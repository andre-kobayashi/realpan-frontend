import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─────────────────────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────────────────────
type OrderProduct = {
  code: string;
  ja: string;
  pt: string;
  qty: number;
  cat: string;
};

type OrderPayload = {
  form: {
    company: string;
    contact: string;
    email: string;
    phone: string;
    customerNo: string;
    deliveryDate: string;
    notes: string;
  };
  products: OrderProduct[];
  total: number;
  locale: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO DO TRANSPORTE SMTP
// ─────────────────────────────────────────────────────────────────────────────
function createTransport() {
  // Opção 1: SMTP externo (Gmail, SendGrid, Mailgun, etc.)
  // Configurar via .env.local
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Opção 2: Postfix local no VPS (padrão quando SMTP_HOST não configurado)
  return nodemailer.createTransport({
    host: '127.0.0.1',
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// GERADOR DE EMAIL HTML
// ─────────────────────────────────────────────────────────────────────────────
function buildEmailHTML(data: OrderPayload): string {
  const { form, products, total } = data;
  const isJa = data.locale === 'ja';
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  // Agrupar produtos por categoria
  const byCategory: Record<string, OrderProduct[]> = {};
  products.forEach(p => {
    if (!byCategory[p.cat]) byCategory[p.cat] = [];
    byCategory[p.cat].push(p);
  });

  const productRows = Object.entries(byCategory).map(([cat, items]) => `
    <tr>
      <td colspan="3" style="background:#FAF7F2;padding:8px 16px;font-size:11px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e5e7eb;">
        ${cat}
      </td>
    </tr>
    ${items.map(p => `
    <tr>
      <td style="padding:10px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f3f4f6;">
        ${isJa ? p.ja : p.pt}
      </td>
      <td style="padding:10px 16px;font-size:11px;color:#9ca3af;border-bottom:1px solid #f3f4f6;">
        ${p.code}
      </td>
      <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#ea580c;text-align:right;border-bottom:1px solid #f3f4f6;">
        ×${p.qty}
      </td>
    </tr>`).join('')}
  `).join('');

  return `<!DOCTYPE html>
<html lang="${isJa ? 'ja' : 'pt'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>📦 ${isJa ? '法人注文' : 'Pedido Corporativo'} — Real Pan</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">

  <!-- WRAPPER -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#ea580c,#f97316);padding:32px 40px;text-align:center;">
            <p style="margin:0 0 4px;color:rgba(255,255,255,.8);font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">
              REAL PAN — ${isJa ? '法人注文' : 'PEDIDO CORPORATIVO'}
            </p>
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
              📦 ${isJa ? '新規注文が届きました' : 'Novo Pedido Recebido'}
            </h1>
            <p style="margin:12px 0 0;color:rgba(255,255,255,.75);font-size:13px;">
              ${now} (JST)
            </p>
          </td>
        </tr>

        <!-- DADOS DO CLIENTE -->
        <tr>
          <td style="padding:32px 40px 16px;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">
              ${isJa ? '👤 お客様情報' : '👤 Dados do Cliente'}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              ${[
                [isJa ? '会社名' : 'Empresa', form.company],
                [isJa ? '担当者名' : 'Responsável', form.contact],
                [isJa ? 'お客様番号' : 'Nº Cliente', form.customerNo],
                [isJa ? 'メールアドレス' : 'E-mail', `<a href="mailto:${form.email}" style="color:#ea580c">${form.email}</a>`],
                [isJa ? '電話番号' : 'Telefone', `<a href="tel:${form.phone}" style="color:#ea580c">${form.phone}</a>`],
                [isJa ? 'お届け希望日' : 'Entrega Desejada', `<strong style="color:#ea580c">${form.deliveryDate}</strong>`],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
                <td style="padding:12px 16px;font-size:12px;color:#6b7280;white-space:nowrap;width:140px;">${label}</td>
                <td style="padding:12px 16px;font-size:13px;color:#111827;font-weight:500;">${value}</td>
              </tr>`).join('')}
              ${form.notes ? `
              <tr style="background:#fffbeb;">
                <td style="padding:12px 16px;font-size:12px;color:#6b7280;vertical-align:top;white-space:nowrap;">${isJa ? '備考' : 'Observações'}</td>
                <td style="padding:12px 16px;font-size:13px;color:#111827;font-style:italic;">${form.notes}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        <!-- PRODUTOS -->
        <tr>
          <td style="padding:16px 40px 32px;">
            <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">
              🛒 ${isJa ? 'ご注文商品' : 'Produtos Pedidos'}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr style="background:#FAF7F2;">
                <th style="padding:10px 16px;font-size:11px;color:#6b7280;text-align:left;font-weight:600;">${isJa ? '商品名' : 'Produto'}</th>
                <th style="padding:10px 16px;font-size:11px;color:#6b7280;text-align:left;font-weight:600;">${isJa ? 'コード' : 'Código'}</th>
                <th style="padding:10px 16px;font-size:11px;color:#6b7280;text-align:right;font-weight:600;">${isJa ? '数量' : 'Qtd'}</th>
              </tr>
              ${productRows}
            </table>

            <!-- TOTAL -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;background:linear-gradient(135deg,#1f2937,#374151);border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:16px 20px;color:#d1d5db;font-size:13px;">${isJa ? '合計数量' : 'Total de itens'}</td>
                <td style="padding:16px 20px;text-align:right;color:#fb923c;font-size:22px;font-weight:800;">${total} ${isJa ? '個' : 'un'}</td>
              </tr>
              <tr>
                <td style="padding:0 20px 16px;color:#9ca3af;font-size:12px;">${isJa ? '商品種類' : 'Tipos diferentes'}</td>
                <td style="padding:0 20px 16px;text-align:right;color:#9ca3af;font-size:12px;">${products.length} ${isJa ? '種類' : 'produtos'}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER AÇÕES -->
        <tr>
          <td style="background:#FAF7F2;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0 0 16px;font-size:13px;color:#6b7280;">
              ${isJa ? 'お客様にご連絡ください：' : 'Entre em contato com o cliente:'}
            </p>
            <a href="mailto:${form.email}?subject=${encodeURIComponent(isJa ? `ご注文確認 - お客様番号 ${form.customerNo}` : `Confirmação de Pedido - Cliente ${form.customerNo}`)}"
               style="display:inline-block;background:linear-gradient(135deg,#ea580c,#f97316);color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:50px;text-decoration:none;margin-bottom:8px;">
              📧 ${isJa ? 'お客様に返信する' : 'Responder ao Cliente'}
            </a>
            <p style="margin:8px 0 0;font-size:11px;color:#9ca3af;">
              ${form.email}
            </p>
          </td>
        </tr>

        <!-- BOTTOM -->
        <tr>
          <td style="background:#1f2937;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#6b7280;">
              © Real Pan — 〒435-0016 静岡県浜松市中央区高塚町1620 — 053-570-2555
            </p>
            <p style="margin:4px 0 0;font-size:10px;color:#4b5563;">
              ${isJa ? 'このメールは法人注文フォームから自動送信されました' : 'Este e-mail foi enviado automaticamente pelo formulário de pedido B2B'}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXTO PLAIN (fallback)
// ─────────────────────────────────────────────────────────────────────────────
function buildEmailText(data: OrderPayload): string {
  const { form, products, total } = data;
  const isJa = data.locale === 'ja';
  const lines = [
    `${'='.repeat(50)}`,
    `REAL PAN — ${isJa ? '法人注文' : 'PEDIDO CORPORATIVO'}`,
    `${'='.repeat(50)}`,
    '',
    `[${isJa ? 'お客様情報' : 'DADOS DO CLIENTE'}]`,
    `${isJa ? '会社名' : 'Empresa'}: ${form.company}`,
    `${isJa ? '担当者名' : 'Responsável'}: ${form.contact}`,
    `${isJa ? 'お客様番号' : 'Nº Cliente'}: ${form.customerNo}`,
    `${isJa ? 'メール' : 'E-mail'}: ${form.email}`,
    `${isJa ? '電話' : 'Telefone'}: ${form.phone}`,
    `${isJa ? 'お届け希望日' : 'Entrega'}: ${form.deliveryDate}`,
    form.notes ? `${isJa ? '備考' : 'Observações'}: ${form.notes}` : '',
    '',
    `[${isJa ? 'ご注文商品' : 'PRODUTOS'}]`,
    ...products.map(p => `  ${isJa ? p.ja : p.pt} (${p.code}) × ${p.qty}`),
    '',
    `${isJa ? '合計' : 'TOTAL'}: ${total} ${isJa ? '個' : 'unidades'} / ${products.length} ${isJa ? '種類' : 'tipos'}`,
    `${'='.repeat(50)}`,
  ];
  return lines.filter(l => l !== '').join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER DA API
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data: OrderPayload = await req.json();
    const { form, products, total } = data;

    // Validação básica
    if (!form.company || !form.email || !form.customerNo || products.length === 0) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    const transporter = createTransport();
    const isJa = data.locale === 'ja';
    const subject = isJa
      ? `📦 [法人注文] ${form.company}（${form.customerNo}）— ${total}個`
      : `📦 [Pedido B2B] ${form.company} (${form.customerNo}) — ${total} itens`;

    // 1. Email para o pedido interno (order@realpan.jp)
    await transporter.sendMail({
      from:    `"Real Pan Sistema" <noreply@realpan.jp>`,
      to:      process.env.ORDER_EMAIL || 'order@realpan.jp',
      replyTo: form.email,
      subject,
      text:    buildEmailText(data),
      html:    buildEmailHTML(data),
    });

    // 2. Email de confirmação para o cliente
    const confirmSubject = isJa
      ? `【Real Pan】ご注文を承りました — ${form.customerNo}`
      : `【Real Pan】Pedido Recebido — ${form.customerNo}`;

    // Agrupar produtos por categoria para o email de confirmação
    const byCatConfirm: Record<string, OrderProduct[]> = {};
    products.forEach(p => {
      if (!byCatConfirm[p.cat]) byCatConfirm[p.cat] = [];
      byCatConfirm[p.cat].push(p);
    });

    const confirmProductRows = Object.entries(byCatConfirm).map(([cat, items]) => `
      <tr>
        <td colspan="3" style="background:#FAF7F2;padding:6px 16px;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #e5e7eb;">
          ${cat}
        </td>
      </tr>
      ${items.map(p => `
      <tr>
        <td style="padding:9px 16px;font-size:12px;color:#374151;border-bottom:1px solid #f3f4f6;">
          ${isJa ? p.ja : p.pt}
        </td>
        <td style="padding:9px 16px;font-size:11px;color:#9ca3af;border-bottom:1px solid #f3f4f6;white-space:nowrap;">
          ${p.code}
        </td>
        <td style="padding:9px 16px;font-size:13px;font-weight:700;color:#ea580c;text-align:right;border-bottom:1px solid #f3f4f6;white-space:nowrap;">
          ×${p.qty}
        </td>
      </tr>`).join('')}
    `).join('');

    const confirmHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#ea580c,#f97316);padding:28px 40px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800;">
              ✅ ${isJa ? 'ご注文を承りました' : 'Pedido Recebido!'}
            </h1>
          </td>
        </tr>

        <!-- SAUDAÇÃO -->
        <tr>
          <td style="padding:28px 40px 16px;">
            <p style="margin:0 0 12px;font-size:15px;color:#374151;">
              ${isJa ? `${form.contact} 様` : `Olá, ${form.contact}!`}
            </p>
            <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
              ${isJa
                ? `${form.company} 様のご注文を承りました。担当者より確認のご連絡をいたします。しばらくお待ちください。`
                : `Recebemos o pedido de ${form.company}. Nossa equipe entrará em contato em breve para confirmar.`}
            </p>

            <!-- RESUMO -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;border-radius:12px;margin-bottom:20px;">
              <tr>
                <td style="padding:16px 20px 8px;">
                  <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">
                    ${isJa ? '注文概要' : 'Resumo'}
                  </p>
                  <p style="margin:0;font-size:13px;color:#374151;line-height:1.8;">
                    ${isJa ? 'お客様番号' : 'Nº Cliente'}: <strong>${form.customerNo}</strong><br/>
                    ${isJa ? 'お届け希望日' : 'Entrega Desejada'}: <strong style="color:#ea580c">${form.deliveryDate}</strong><br/>
                    ${isJa ? '合計数量' : 'Total'}: <strong style="color:#ea580c">${total} ${isJa ? '個' : 'itens'} / ${products.length} ${isJa ? '種類' : 'tipos'}</strong>
                  </p>
                </td>
              </tr>
            </table>

            <!-- LISTA DE PRODUTOS -->
            <p style="margin:0 0 10px;font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;">
              🛒 ${isJa ? 'ご注文商品一覧' : 'Lista de Produtos Pedidos'}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <tr style="background:#f9fafb;">
                <th style="padding:8px 16px;font-size:10px;color:#6b7280;text-align:left;font-weight:600;">${isJa ? '商品名' : 'Produto'}</th>
                <th style="padding:8px 16px;font-size:10px;color:#6b7280;text-align:left;font-weight:600;">${isJa ? 'コード' : 'Código'}</th>
                <th style="padding:8px 16px;font-size:10px;color:#6b7280;text-align:right;font-weight:600;">${isJa ? '数量' : 'Qtd'}</th>
              </tr>
              ${confirmProductRows}
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#1f2937;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#6b7280;">
              Real Pan — 053-570-2555 — contato@realpan.jp
            </p>
            <p style="margin:4px 0 0;font-size:10px;color:#4b5563;">
              ${isJa ? 'このメールは注文フォームから自動送信されました' : 'E-mail enviado automaticamente pelo formulário de pedido'}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from:    `"Real Pan" <noreply@realpan.jp>`,
      to:      form.email,
      subject: confirmSubject,
      text:    isJa
        ? `ご注文ありがとうございます。担当者より確認のご連絡をいたします。\n\nお客様番号: ${form.customerNo}\nお届け希望日: ${form.deliveryDate}\n合計: ${total}個`
        : `Pedido recebido! Entraremos em contato em breve.\n\nNº Cliente: ${form.customerNo}\nEntrega: ${form.deliveryDate}\nTotal: ${total} itens`,
      html: confirmHtml,
    });

    return NextResponse.json({
      success: true,
      message: isJa ? 'ご注文を承りました' : 'Pedido enviado com sucesso',
    });

  } catch (err: any) {
    console.error('[ORDER API ERROR]', err);
    return NextResponse.json(
      { error: 'Erro ao enviar email', detail: err?.message },
      { status: 500 }
    );
  }
}