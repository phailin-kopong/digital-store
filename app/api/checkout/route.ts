import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(request: Request) {
  try {
    const { cart } = await request.json();
    
    // 🟢 ดึง URL ของเว็บปัจจุบันอัตโนมัติ (ไม่ว่าจะเป็น Vercel หรือ Localhost)
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: 'thb',
        product_data: {
          name: item.title,
        },
        unit_amount: item.price * 100, 
      },
      quantity: 1, 
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: 'payment',
      success_url: `${origin}/success`, // 🟢 ใช้ตัวแปร origin แทน localhost
      cancel_url: `${origin}/`,       // 🟢 ใช้ตัวแปร origin แทน localhost
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}