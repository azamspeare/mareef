<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $title ?? 'Mareff' }}</title>
    <style>
        /* Reset */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        table {
            border-collapse: collapse !important;
        }
        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* Main styles */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f4f4f5;
            color: #18181b;
            line-height: 1.6;
        }

        .email-wrapper {
            width: 100%;
            background-color: #f4f4f5;
            padding: 40px 20px;
        }

        .email-container {
            max-width: 560px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .email-header {
            background: linear-gradient(135deg, #18181b 0%, #27272a 100%);
            padding: 32px 40px;
            text-align: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: -0.5px;
        }

        .email-body {
            padding: 40px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #18181b;
            margin: 0 0 24px 0;
        }

        .content p {
            font-size: 15px;
            color: #3f3f46;
            margin: 0 0 16px 0;
        }

        .highlight-box {
            background-color: #fafafa;
            border-left: 4px solid #18181b;
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }

        .highlight-box .label {
            font-size: 12px;
            font-weight: 500;
            color: #71717a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 4px 0;
        }

        .highlight-box .value {
            font-size: 16px;
            font-weight: 600;
            color: #18181b;
            margin: 0;
        }

        .btn-primary {
            display: inline-block;
            background-color: #18181b;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            margin: 8px 0;
            transition: background-color 0.2s;
        }

        .btn-primary:hover {
            background-color: #27272a;
        }

        .btn-secondary {
            display: inline-block;
            background-color: #f4f4f5;
            color: #18181b !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            margin: 8px 0;
        }

        .divider {
            height: 1px;
            background-color: #e4e4e7;
            margin: 32px 0;
        }

        .secondary-section {
            background-color: #fafafa;
            padding: 20px 24px;
            border-radius: 8px;
            margin: 24px 0;
        }

        .secondary-section p {
            font-size: 14px;
            color: #52525b;
            margin: 0 0 12px 0;
        }

        .secondary-section p:last-child {
            margin-bottom: 0;
        }

        .feature-list {
            margin: 20px 0;
            padding: 0;
            list-style: none;
        }

        .feature-list li {
            font-size: 15px;
            color: #3f3f46;
            padding: 8px 0;
            padding-left: 28px;
            position: relative;
        }

        .feature-list li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 18px;
            height: 18px;
            background-color: #dcfce7;
            border-radius: 50%;
        }

        .feature-list li::after {
            content: '✓';
            position: absolute;
            left: 4px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 11px;
            color: #16a34a;
            font-weight: 600;
        }

        .email-footer {
            padding: 32px 40px;
            background-color: #fafafa;
            text-align: center;
            border-top: 1px solid #e4e4e7;
        }

        .footer-text {
            font-size: 13px;
            color: #71717a;
            margin: 0 0 8px 0;
        }

        .footer-link {
            color: #18181b;
            text-decoration: none;
            font-weight: 500;
        }

        .footer-link:hover {
            text-decoration: underline;
        }

        /* Responsive */
        @media only screen and (max-width: 600px) {
            .email-wrapper {
                padding: 20px 16px;
            }
            .email-header {
                padding: 24px;
            }
            .email-body {
                padding: 24px;
            }
            .email-footer {
                padding: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <table class="email-container" role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td class="email-header">
                    <a href="https://mareef.uz" class="logo">Mareff</a>
                </td>
            </tr>
            <tr>
                <td class="email-body">
                    {{ $slot }}
                </td>
            </tr>
            <tr>
                <td class="email-footer">
                    <p class="footer-text">{{ $footerText ?? 'Thanks for using Mareff.' }}</p>
                    <p class="footer-text">
                        <a href="https://mareef.uz" class="footer-link">mareef.uz</a>
                    </p>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
