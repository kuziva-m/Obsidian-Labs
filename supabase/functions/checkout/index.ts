import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  variants: { id: string; price: number }[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { items, customerDetails, shippingMethod, shippingCost } =
      await req.json();

    // 1. Calculate Totals
    const variantIds = items.map((item: CartItem) => {
      if (!item.variants || item.variants.length === 0)
        throw new Error(`Product ${item.name} has no variants.`);
      return item.variants[0].id;
    });

    const { data: dbVariants, error: dbError } = await supabaseClient
      .from("variants")
      .select(`*, products(name, short_name)`)
      .in("id", variantIds);

    if (dbError) throw dbError;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items as CartItem[]) {
      const variantId = item.variants[0].id;
      const dbItem = dbVariants?.find(
        (v: { id: string }) => v.id === variantId,
      );

      if (!dbItem) continue;

      const itemTotal = dbItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        variant_id: dbItem.id,
        quantity: item.quantity,
        price_at_purchase: dbItem.price,
        product_name: dbItem.products.name,
        total: itemTotal,
      });
    }

    const totalAmount = subtotal + shippingCost;

    // 2. Create Order
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        customer_email: customerDetails.email,
        customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        shipping_address: customerDetails,
        status: "on_hold",
        payment_method: "bank_transfer",
        shipping_method: shippingMethod,
        shipping_cost: shippingCost,
        total_amount: totalAmount,
        created_at: new Date().toISOString(),
      })
      .select("id, created_at")
      .single();

    if (orderError) throw orderError;

    // 3. Save Order Items
    const dbItemsPayload = orderItems.map(
      ({ variant_id, quantity, price_at_purchase }) => ({
        variant_id,
        quantity,
        price_at_purchase,
        order_id: order.id,
      }),
    );

    const { error: itemsError } = await supabaseClient
      .from("order_items")
      .insert(dbItemsPayload);
    if (itemsError) throw itemsError;

    // 4. Send Styled Email
    const productRows = orderItems
      .map(
        (item) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0; color: #111; font-weight: 500;">${item.product_name}</td>
        <td style="padding: 12px 0; text-align: center; color: #666;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; color: #111;">$${item.price_at_purchase.toFixed(2)}</td>
      </tr>
    `,
      )
      .join("");

    const date = new Date(order.created_at).toLocaleDateString("en-AU");
    const logoUrl = "https://obsidianlabs-au.com/assets/obsidian-logo-red.png";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1b1b1b; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f5; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 40px; border-top: 6px solid #ce2a34; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f4f4f5; padding-bottom: 20px; }
          .logo { width: 180px; height: auto; margin-bottom: 10px; }
          .status-badge { display: inline-block; background: #fff1f2; color: #ce2a34; font-weight: bold; padding: 6px 12px; border-radius: 4px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 14px; font-weight: bold; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          
          .bank-box { background: #f8fafc; border: 1px solid #e2e8f0; color: #1b1b1b; padding: 20px; border-radius: 4px; }
          .bank-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-family: monospace; font-size: 14px; }
          .bank-label { color: #64748b; font-weight: bold; font-size: 12px; text-transform: uppercase; }
          .bank-val { font-weight: bold; color: #1b1b1b; }
          
          /* WARNING BOX STYLE */
          .warning-box { background-color: #fef2f2; border: 2px solid #ef4444; color: #991b1b; padding: 15px; border-radius: 4px; margin-top: 20px; font-size: 14px; line-height: 1.5; }
          .warning-title { font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 8px; color: #b91c1c; }

          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { text-align: left; color: #666; font-size: 12px; text-transform: uppercase; padding-bottom: 10px; border-bottom: 2px solid #eee; }
          .totals { margin-top: 20px; border-top: 2px solid #1b1b1b; padding-top: 15px; }
          .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .grand-total { font-size: 20px; font-weight: 800; color: #ce2a34; margin-top: 10px; }
          .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          
          <div class="header">
            <img src="${logoUrl}" alt="Obsidian Labs" class="logo" />
            <br/>
            <div class="status-badge">Payment Required</div>
          </div>

          <p>Hi ${customerDetails.firstName},</p>
          <p>Thank you for your order. We have reserved your items. Please complete the bank transfer below to finalize your shipment.</p>
          
          <div class="section">
            <div class="section-title">Transfer Instructions</div>
            <div class="bank-box">
              <div class="bank-row">
                <span class="bank-label">Bank Name</span>
                <span class="bank-val">Obsidian Labs AU</span>
              </div>
              <div class="bank-row">
                <span class="bank-label">BSB</span>
                <span class="bank-val">062-000</span>
              </div>
              <div class="bank-row">
                <span class="bank-label">Account</span>
                <span class="bank-val">1234 5678</span>
              </div>
              <div class="bank-row" style="margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                <span class="bank-label">Reference</span>
                <span class="bank-val">#${order.id.slice(0, 8)}</span>
              </div>
            </div>

            <div class="warning-box">
              <span class="warning-title">⚠ IMPORTANT: Reference Requirement</span>
              <p style="margin: 0 0 10px 0;">
                You <strong>MUST</strong> use <strong>ONLY your Order Reference (#${order.id.slice(0, 8)})</strong> as the transaction description.
              </p>
              <p style="margin: 0 0 10px 0;">
                <strong>DO NOT</strong> use terms like "Peptides", "BPC", "Reta", or product names.
              </p>
              <p style="margin: 0; font-weight: bold; color: #7f1d1d;">
                Failure to strictly follow this instruction will result in your order being unidentifiable and potentially lost.
              </p>
            </div>

          </div>

          <div class="section">
            <div class="section-title">Order Summary (#${order.id.slice(0, 8)})</div>
            <table>
              <thead>
                <tr>
                  <th width="60%">Item</th>
                  <th width="15%" style="text-align: center;">Qty</th>
                  <th width="25%" style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>${productRows}</tbody>
            </table>

            <div class="totals">
              <div class="total-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
              <div class="total-row"><span>Shipping</span><span>$${shippingCost.toFixed(2)}</span></div>
              <div class="total-row grand-total"><span>Total AUD</span><span>$${totalAmount.toFixed(2)}</span></div>
            </div>
          </div>

          <div class="footer">
            <p>Questions? Reply to this email or contact <a href="mailto:obsidianlabsau@gmail.com" style="color: #ce2a34; text-decoration: none;">admin@obsidianlabs.com.au</a></p>
            <p>&copy; 2026 Obsidian Labs. Australia.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: "Obsidian Labs <orders@obsidianlabs-au.com>",
      to: [customerDetails.email],
      subject: `Order #${order.id.slice(0, 8)} Confirmation`,
      html: emailHtml,
    });

    if (emailError) console.error("Resend Error:", emailError);

    return new Response(JSON.stringify({ orderId: order.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
