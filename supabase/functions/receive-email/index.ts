import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

serve(async (req) => {
  try {
    const payload = await req.json();
    const data = payload.data || payload;
    const emailId = data.email_id;

    if (!emailId) throw new Error("No email_id found in payload");

    // Fetch the full email content from Resend
    const resendResponse = await fetch(
      `https://api.resend.com/emails/receiving/${emailId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!resendResponse.ok) {
      throw new Error(`Failed to fetch email from Resend`);
    }

    const emailData = await resendResponse.json();

    const html = emailData.html || "";
    const text = emailData.text || "";
    let bodyText = text;

    if (!bodyText && html) {
      bodyText = html
        .replace(/<[^>]*>?/gm, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    const sender = emailData.from || data.from || "(Unknown Sender)";
    const subject = emailData.subject || data.subject || "(No Subject)";

    const { error: dbError } = await supabase.from("inbox_messages").insert({
      sender: sender,
      subject: subject,
      body_text: bodyText || "(No content)",
      body_html: html || bodyText,
    });

    if (dbError) throw dbError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Inbound Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
