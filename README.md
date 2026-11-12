# Little Leaf — Children’s Clinic

A responsive pediatric clinic website with a white, forest green, and mint design, rounded Nunito headings, and a locally stored AI-generated pediatric care image.

## Run locally

```powershell
npx.cmd --yes http-server . -a 127.0.0.1 -p 8080 -c-1
```

Open http://localhost:8080.

## Files

- `index.html`: homepage, services, parent FAQs, and demo visit form.
- `assets/children.css`: responsive shared design.
- `assets/children.js`: mobile navigation and local demo form behavior.
- Supporting HTML pages share the pediatric design. Original service URLs are retained for compatibility.

The clinic identity and sample address are illustrative. The visit form prepares a WhatsApp enquiry using the parent name, care type, preferred date, and optional email. Visitors review and send the message in WhatsApp; the clinic must confirm the appointment. The application does not store form entries. Fonts load from Google Fonts; generated clinic images are stored locally.

Set the WhatsApp recipient in `assets/clinic-config.js` using the country code and subscriber number, digits only. A floating WhatsApp button is available across all clinic pages.

## Original template credits

Originally based on CardioCare by K29Solutions, distributed by ThemeWagon. Original design and code copyright belongs to K29Solutions.
