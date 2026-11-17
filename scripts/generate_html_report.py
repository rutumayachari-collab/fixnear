import os

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FixNear — Project Report & Documentation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

    :root {
      --primary: #0B1F3A;
      --primary-light: #1E3A8A;
      --emerald: #10B981;
      --emerald-dark: #047857;
      --bg-light: #F8F8F5;
      --card-bg: #FFFFFF;
      --text-main: #1E293B;
      --text-muted: #64748B;
      --border: #E2E8F0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-light);
      color: var(--text-main);
      line-height: 1.65;
      padding: 40px 20px;
    }

    .report-container {
      max-width: 900px;
      margin: 0 auto;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 50px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    }

    header {
      border-bottom: 2px solid var(--border);
      padding-bottom: 30px;
      margin-bottom: 36px;
    }

    .badge {
      display: inline-block;
      background: #ECFDF5;
      color: var(--emerald-dark);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 4px 12px;
      border-radius: 999px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    h1 {
      font-size: 32px;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 16px;
      color: var(--text-muted);
      margin-bottom: 20px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      background: #F1F5F9;
      padding: 16px;
      border-radius: 10px;
      font-size: 13px;
    }

    .meta-grid div strong {
      display: block;
      color: var(--primary);
      font-size: 12px;
      text-transform: uppercase;
    }

    h2 {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary);
      margin: 36px 0 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }

    h3 {
      font-size: 17px;
      font-weight: 600;
      color: var(--primary-light);
      margin: 20px 0 10px;
    }

    p {
      margin-bottom: 14px;
      color: #334155;
    }

    ul, ol {
      margin-left: 24px;
      margin-bottom: 16px;
      color: #334155;
    }

    li {
      margin-bottom: 8px;
    }

    .card {
      background: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      margin: 16px 0;
    }

    .card-emerald {
      background: #F0FDF4;
      border-color: #86EFAC;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }

    th, td {
      border: 1px solid var(--border);
      padding: 10px 14px;
      text-align: left;
    }

    th {
      background: var(--primary);
      color: #FFFFFF;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background: #F8FAFC;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      background: #EEF2F6;
      padding: 2px 6px;
      border-radius: 4px;
      color: #0F172A;
    }

    pre {
      background: #0B1F3A;
      color: #E2E8F0;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      margin: 16px 0;
    }

    .kpi-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 20px 0;
    }

    .kpi-box {
      background: #F8FAFC;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      text-align: center;
    }

    .kpi-box .number {
      font-size: 28px;
      font-weight: 800;
      color: var(--emerald-dark);
    }

    .kpi-box .label {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .report-container {
        border: none;
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      .kpi-box, .card {
        page-break-inside: avoid;
      }
      h2 {
        page-break-before: auto;
      }
    }
  </style>
</head>
<body>

<div class="report-container">
  <header>
    <span class="badge">Innovation & Software Product Report</span>
    <h1>FixNear — Local Repair & Service Finder</h1>
    <div class="subtitle">A Hyperlocal, 0% Commission Home Services Marketplace for Indian Households</div>
    <div class="meta-grid">
      <div><strong>Domain</strong> Full-Stack Engineering & Hyperlocal Tech</div>
      <div><strong>Target Region</strong> Indian Urban & Semi-Urban Localities</div>
      <div><strong>Active Deployment</strong> Unified Single Domain (Cloudflare Edge)</div>
      <div><strong>Quality Assurance</strong> 97 Frontend Tests • 14 E2E Backend Tests</div>
    </div>
  </header>

  <div class="kpi-row">
    <div class="kpi-box">
      <div class="number">0%</div>
      <div class="label">Platform Commission</div>
    </div>
    <div class="kpi-box">
      <div class="number">100%</div>
      <div class="label">Automated Test Pass Rate</div>
    </div>
    <div class="kpi-box">
      <div class="number">₹0</div>
      <div class="label">Third-Party API Cost</div>
    </div>
  </div>

  <h2>1. Executive Summary & Problem Context</h2>
  <p>In Indian cities, domestic maintenance services (plumbing, electrical repairs, appliance servicing, carpentry) operate with substantial economic and technological friction. Large commercial aggregators like Urban Company deduct <strong>20% to 30% commission</strong> from informal technicians, forcing prices higher for homeowners while suppressing worker take-home income.</p>
  <p>Meanwhile, traditional business directories (Justdial, Sulekha) fail to provide real-time booking, instead distributing user contact information to telemarketers. When an urgent emergency occurs (e.g., a burst pipe or sparking switchboard), families are left without verified local options.</p>

  <h2>2. Core Technological & Social Innovations</h2>
  <div class="card card-emerald">
    <h3>Innovation 1: 0% Platform Commission Model</h3>
    <p>FixNear functions as a decentralized direct connection protocol rather than an extractive intermediary. Service technicians keep 100% of their visit fees and build long-term neighborhood relationships.</p>
  </div>

  <div class="card">
    <h3>Innovation 2: Dual-Mode Proximity Engine (Haversine + Indian PIN Codes)</h3>
    <p>Distance is calculated mathematically using the spherical <strong>Haversine Formula</strong> (mean Earth radius <em>R = 6,371 km</em>) to accurately compute straight-line distance without paid Google Maps APIs. For indoor privacy or when GPS is denied, the system seamlessly falls back to <strong>6-digit Indian PIN codes</strong> (e.g., <code>411038</code>), ranking matching providers at Position #1.</p>
  </div>

  <div class="card">
    <h3>Innovation 3: Zero-Cost Native Telephony (RFC 3966)</h3>
    <p>Instead of requiring costly VoIP cloud telephony servers (Twilio/Exotel), FixNear utilizes standard <code>tel:</code> URIs. Tapping "Call Customer" directly triggers native OS implicit intents (<code>ACTION_DIAL</code> on Android, <code>MobilePhone.app</code> handshake on iOS), pre-populating the 10-digit number into the device dialer. This leverages free unlimited domestic calling over Jio, Airtel, and Vi.</p>
  </div>

  <h2>3. System Architecture & Technical Specifications</h2>
  <table>
    <thead>
      <tr>
        <th>Tier</th>
        <th>Technologies</th>
        <th>Role & Architecture Decision</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Client Tier</strong></td>
        <td>React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons</td>
        <td>Reactive single-page application with type safety, responsive SaaS layout, and instant UI state transitions.</td>
      </tr>
      <tr>
        <td><strong>Mapping Tier</strong></td>
        <td>Leaflet 1.9, OpenStreetMap</td>
        <td>Free map rendering with zero billing risk, custom markers, and automatic popup details.</td>
      </tr>
      <tr>
        <td><strong>Server Tier</strong></td>
        <td>Node.js v24, Express 5, Bcrypt.js, JWT</td>
        <td>Unified single-origin architecture serving both compiled client assets and <code>/api/*</code> REST endpoints on port 5001.</td>
      </tr>
      <tr>
        <td><strong>Resilience</strong></td>
        <td>React Error Boundary, SPA Fallback Middleware</td>
        <td>Prevents blank white screens; provides user-friendly error recovery; deep route refreshes served cleanly.</td>
      </tr>
      <tr>
        <td><strong>Data Tier</strong></td>
        <td>Dual-Mode JSON Engine + Mongo Adapter</td>
        <td>Persistent multi-session state in <code>fixnear_db.json</code> with seamless MongoDB migration capability.</td>
      </tr>
    </tbody>
  </table>

  <h2>4. Core Mathematical Formulation</h2>
  <p>To accurately find distances across the curvature of the Earth without Euclidean distortion:</p>
  <pre>
Δlat = (lat2 - lat1) * π / 180
Δlon = (lon2 - lon1) * π / 180
a = sin²(Δlat / 2) + cos(lat1 * π / 180) * cos(lat2 * π / 180) * sin²(Δlon / 2)
c = 2 * atan2(√a, √(1 - a))
Distance (km) = 6371 * c
  </pre>

  <h2>5. Rigorous Automated Verification Results</h2>
  <div class="card card-emerald">
    <h3>Automated Test Execution Summary</h3>
    <ul>
      <li><strong>Frontend Unit & Integration Tests:</strong> <code>97 Passed, 0 Failed (100%)</code></li>
      <li><strong>Backend End-to-End REST API Tests:</strong> <code>14 Passed, 0 Failed (100%)</code></li>
      <li><strong>TypeScript Production Compilation:</strong> <code>0 Errors</code></li>
    </ul>
  </div>

  <h2>6. Live Demonstration Guide for Evaluators</h2>
  <ol>
    <li><strong>Open Single Website:</strong> Navigate to <code>https://senate-trip-rec-franchise.trycloudflare.com</code> (or <code>http://localhost:5001</code>).</li>
    <li><strong>Helper Registration:</strong> Click <em>"I Am a Helper"</em> &rarr; Register a technician with trade <strong>Plumbing</strong>, PIN <strong>411038</strong>, and rate <strong>₹199</strong>.</li>
    <li><strong>Customer Discovery:</strong> Navigate to <em>Services</em> &rarr; Search <strong>Plumbing</strong> and PIN <strong>411038</strong> &rarr; Observe the newly registered technician ranked at <strong>Position #1</strong> with the <em>✨ Verified Helper</em> badge.</li>
    <li><strong>Booking Creation:</strong> Click <em>"Book Service"</em> &rarr; Enter repair notes &rarr; Booking generated with unique ID <code>FN-XXXXX</code>.</li>
    <li><strong>Worker Management:</strong> Open the <strong>Worker Portal (/worker)</strong> &rarr; View new job card &rarr; Tap <em>"Call Customer"</em> (demonstrating RFC 3966 dialer) &rarr; Tap <em>"Accept Job"</em> &rarr; Tap <em>"Mark Completed"</em>.</li>
    <li><strong>Admin Dashboard:</strong> Open <strong>Admin (/admin)</strong> &rarr; Verify platform booking counts and completed revenue dynamically updated in <strong>₹</strong>.</li>
  </ol>

  <p style="margin-top: 40px; font-size: 13px; color: var(--text-muted); text-align: center;">
    FixNear — Final Academic Submission & Product Report • Unified Deployment Port 5001 • All Rights Reserved.
  </p>
</div>

</body>
</html>
"""

with open("c:\\Users\\vedan\\Downloads\\fixnear\\FixNear_Project_Report.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("FixNear_Project_Report.html created successfully!")
