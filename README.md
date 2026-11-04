# CloudDeck

An Expo / React Native app that teaches AWS services to beginners. There's no backend or database: all content lives in one JSON file that ships inside the app.

## What's in v1

- **168 AWS services** in 16 color-coded categories (Compute, Containers, Storage, Databases, Networking, Security, Management, Cost, Analytics, AI/ML, Integration, Developer Tools, Front-End & Mobile, Migration, IoT, End User & Business Apps).
- Each service has a beginner-friendly definition, what it's used for, a real-world company scenario, a level (Beginner / Intermediate / Expert) and the AWS certifications it appears on.
- **Screens**
  - **Home** (`src/app/index.tsx`): search, level and certification filters, and a grid of category tiles. When any filter or search is active, the grid is replaced by matching services grouped by category, so you reach a service in one tap.
  - **Category** (`src/app/category/[id].tsx`): every service in the category, with the same level and certification filters.
  - **Service detail** (`src/app/service/[id].tsx`): the full explanation. Tap a certification to see every service on that exam, or jump to related services in the same category.
- **Placeholder icons** (`src/components/placeholder-icon.tsx`): every service and category uses the same rounded tile in its category color with a short label (EC2, S3, λ…). To switch to real artwork, replace this one component.

## Running it

```bash
npm install
npm start          # then press i (iOS), a (Android) or w (web), or scan the QR code with Expo Go
```

Checks:

```bash
npm run typecheck
npx eslint .
npm run validate-data   # checks the JSON for missing fields, duplicate ids, unknown categories/certs
```

## Editing content

All content is in [`src/data/aws-services.json`](src/data/aws-services.json):

```jsonc
{
  "certifications": [{ "id": "SAA", "code": "SAA-C03", "name": "Solutions Architect – Associate", "tier": "Associate" }],
  "levels": ["Beginner", "Intermediate", "Expert"],
  "categories": [{ "id": "compute", "name": "Compute", "abbr": "CPU", "color": "#EA580C", "description": "…" }],
  "services": [
    {
      "id": "ec2",
      "name": "Amazon EC2",
      "shortName": "EC2",              // label on the placeholder icon (≤ 4 chars, unique)
      "category": "compute",           // must match a category id
      "level": "Beginner",
      "definition": "1–2 sentence beginner explanation",
      "usedFor": ["…", "…"],
      "scenario": { "company": "…", "story": "…" },
      "certifications": ["CLF", "SAA"] // certification ids
    }
  ]
}
```

Run `npm run validate-data` after editing.

### Content notes

- Scenario companies are **fictional** examples of realistic use cases. They aren't claims about real customers.
- Certification mappings are based on the current exam guides. Treat them as a study aid, not an official list, and review them when AWS updates an exam.
- Services that AWS has retired or closed to new customers (e.g. QLDB, Cloud9, Forecast) are left out on purpose.
