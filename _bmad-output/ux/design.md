# Design Specification & Design Tokens: SaaSflow

**Document Version:** 1.0.0  
**Design Reference:** Figma File `kQQp6IjO3JC4LjQ6OVIXq9` (File: `User-DashBoard`)  
**UX Designer:** Sally (`🎨`)  

---

## 1. Visual Design Philosophy & Foundations

SaaSflow is designed to communicate **enterprise trust, executive clarity, and operational precision**. Inspired by modern human-centered design principles (Don Norman, Alan Cooper), the visual system blends high-contrast dark foundational navigation (`#0F172A`) with crisp, clean white workspaces (`#FFFFFF`) on a subtle cool-slate canvas (`#F8FAFC`).

The primary accent color **`#4F46E5` (Indigo 600)** serves as the focal beacon for primary actions, active navigational context, and affirmative affordances.

---

## 2. Complete Design Tokens

### 2.1 Color Palette & Hex Codes

| Token Name | Hex / Value | Tailwind Class Equivalent | Role & Applied Context |
| :--- | :--- | :--- | :--- |
| **`primary.accent`** | `#4F46E5` | `indigo-600` | Primary buttons, active nav tab, checkbox fill, active tab indicator, logo background. |
| **`primary.accent-hover`**| `#4338CA` | `indigo-700` | Button hover state, interactive link hover. |
| **`primary.accent-light`**| `#EEF2FF` | `indigo-50` | KPI card icon background container (`40x40px`). |
| **`surface.canvas`** | `#F8FAFC` | `slate-50` | Overall dashboard and login page background base. |
| **`surface.card`** | `#FFFFFF` | `white` | Metric cards, data table container, chart containers, form column. |
| **`surface.sidebar`** | `#0F172A` | `slate-900` | Left sidebar background, mockup header background. |
| **`surface.sidebar-card`**| `#1E293B` | `slate-800` | Workspace switcher pill, user profile card background, mockup window base. |
| **`border.subtle`** | `#E2E8F0` | `slate-200` | Card borders, input field borders, horizontal dividers, table header line. |
| **`border.dark`** | `#334155` | `slate-700` | Sidebar card borders, mockup window borders. |
| **`text.primary`** | `#0F172A` | `slate-900` | Primary headings, table row primary titles, metric numbers. |
| **`text.secondary`** | `#475569` | `slate-600` | Input labels, table subtext, KPI titles, secondary buttons. |
| **`text.muted`** | `#94A3B8` | `slate-400` | Input placeholders, inactive nav icons, breadcrumb separators, timestamp text. |
| **`text.inverse`** | `#FFFFFF` | `white` | Active sidebar nav text, primary button label text. |
| **`semantic.success`** | `#10B981` | `emerald-500` | Positive delta badge text (`+12.5%`), success status pill text, organic traffic. |
| **`semantic.success-bg`**| `#D1FAE5` | `emerald-100` | Positive delta pill background, success status pill background. |
| **`semantic.danger`** | `#EF4444` | `red-500` | Negative delta badge text (`-1.2%`), error status pill text, input error borders. |
| **`semantic.danger-bg`** | `#FEE2E2` | `red-100` | Negative delta pill background, failed status pill background. |
| **`semantic.warning`** | `#F59E0B` | `amber-500` | Pending status pill text, referral traffic indicator. |
| **`semantic.warning-bg`**| `#FEF3C7` | `amber-100` | Pending status pill background. |
| **`glass.card-bg`** | `rgba(255, 255, 255, 0.08)` | — | Testimonial card background (`backdrop-filter: blur(8px)`). |
| **`glass.card-border`**| `rgba(255, 255, 255, 0.1)` | — | Testimonial card border. |

---

### 2.2 Typography Scale (`Inter`)

Font Family: `Inter, system-ui, -apple-system, sans-serif`

| Scale / Hierarchy | Size | Weight | Line Height | Letter Spacing | Tailwind Class | Applied Elements |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 (Auth Header)** | 30px | 700 (Bold) | 38px (1.25) | -0.02em | `text-[30px] font-bold leading-tight tracking-tight` | Login *"Welcome back"* heading |
| **Display (KPI Values)**| 28px | 700 (Bold) | 36px (1.25) | -0.02em | `text-[28px] font-bold leading-none tracking-tight` | KPI Big Numbers (`$48,250`, `2,847`) |
| **H2 (Brand Logo Text)**| 20px | 700 (Bold) | 28px (1.4) | -0.01em | `text-xl font-bold` | Header & Login Brand *"SaaSflow"* |
| **H3 (Sidebar Brand)** | 18px | 700 (Bold) | 24px (1.33) | -0.01em | `text-lg font-bold` | Sidebar Brand Title |
| **H4 (Section Titles)** | 16px | 700 (Bold) | 24px (1.5) | normal | `text-base font-bold` | *"User Engagement Trends"*, *"Recent Activity"* |
| **Quote Body** | 16px | 500 (Medium)| 24px (1.5) | normal | `text-base font-medium leading-relaxed` | Testimonial quote text |
| **Body UI (Medium)** | 14px | 500/600 | 20px (1.4) | normal | `text-sm font-semibold` / `font-medium` | Nav items, Input labels, Buttons, KPI titles |
| **Body UI (Regular)** | 14px | 400 (Regular)| 20px (1.4) | normal | `text-sm font-normal` | Form input values, Subtitles, Breadcrumbs |
| **Table Body / Small** | 13px | 400/600 | 18px (1.4) | normal | `text-[13px] font-normal` / `font-semibold` | Table cells, Remember me, User emails |
| **Caption / Headers** | 12px | 600 (Semi) | 16px (1.33) | 0.05em | `text-xs font-semibold uppercase tracking-wider` | Table header row, Chart subtitles |
| **Badge / Pill Text** | 11px | 600 (Semi) | 14px (1.25) | normal | `text-[11px] font-semibold` | Delta badges (`+12.5%`), Status pills |
| **Micro / Keycap** | 10px | 600 (Semi) | 12px (1.2) | normal | `text-[10px] font-semibold` | Global search shortcut keycap (`⌘K`) |

---

### 2.3 Spacing, Radius, and Elevation Tokens

#### Radius Scale
* **`rounded-xs` (4px):** Checkbox inputs, micro badges (`⌘K` pill).
* **`rounded-sm` (6px):** Delta badges, logo container (sidebar), date range tabs.
* **`rounded-md` (8px):** Form inputs (`input-container`), buttons (`44px` height), nav items (`nav-item`), search input, brand logo badge.
* **`rounded-lg` (10px):** Sidebar user profile card (`profile-card`).
* **`rounded-xl` (12px):** KPI cards (`kpi-card`), Chart containers (`charts-row`), Activity table container (`table-card`).
* **`rounded-2xl` (16px):** Mockup browser window, glassmorphism testimonial card.
* **`rounded-full` (100px / 9999px):** User avatars (`36px` / `40px`), status badges (`status-pill`).

#### Elevation / Shadows
* **Card Shadow:** `0px 4px 12px 0px rgba(0, 0, 0, 0.05)`  
  Tailwind: `shadow-[0_4px_12px_0_rgba(0,0,0,0.05)]` (subtle, clean, executive elevation).
* **Active Dropdown / Modal Shadow:** `0px 10px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.05)`  
  Tailwind: `shadow-xl`.

---

## 3. Tailwind CSS Configuration Snippet

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        saasflow: {
          accent: {
            DEFAULT: '#4F46E5',
            hover: '#4338CA',
            light: '#EEF2FF',
          },
          slate: {
            canvas: '#F8FAFC',
            surface: '#FFFFFF',
            sidebar: '#0F172A',
            surfaceDark: '#1E293B',
            borderDark: '#334155',
            border: '#E2E8F0',
            textPrimary: '#0F172A',
            textSecondary: '#475569',
            textMuted: '#94A3B8',
          },
          status: {
            success: '#10B981',
            successBg: '#D1FAE5',
            danger: '#EF4444',
            dangerBg: '#FEE2E2',
            warning: '#F59E0B',
            warningBg: '#FEF3C7',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 4px 12px 0px rgba(0, 0, 0, 0.05)',
        dropdown: '0px 10px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        card: '12px',
        pill: '100px',
      }
    }
  }
}
```

---

## 4. Component Layout Specifications

### 4.1 Login Screen Layout
* **Desktop Structure:** Dual-column split screen (`1440px` base canvas width).
  * **Left Column (`login-form-col`):** Fixed `576px` width, `padding: 64px`, vertical space-between flex layout.
    * `brand-header`: Logo icon container (`32x32px`, `#4F46E5` fill, `8px` radius) + "SaaSflow" text (`20px`, bold).
    * `intro-headers`: Gap `8px`, H1 `30px` bold, Subtitle `14px` regular (`#475569`).
    * `input-group`: Gap `20px`. Input field heights `44px`, `padding: 12px 16px`, border `1px solid #E2E8F0`, radius `8px`.
    * `button (Sign In)`: Height `44px`, background `#4F46E5`, hover `#4338CA`, text white `14px` semi-bold, radius `8px`.
    * `divider`: Gap `16px`, hairline lines (`#E2E8F0`), label `12px` uppercase `#94A3B8`.
    * `oauth-row`: Dual secondary buttons (`Google`, `GitHub`), height `44px`, border `1px solid #E2E8F0`, radius `8px`.
  * **Right Column (`login-visual-col`):** Fixed `864px` width, `padding: 64px`, background `rgba(15, 23, 42, 0.8)` with hero image cover.
    * `mockup-window`: Width `680px`, background `#1E293B`, border `1px solid #334155`, radius `16px`, shadow card.
    * `testimonial-card`: Width `680px`, background `rgba(255, 255, 255, 0.08)`, border `1px solid rgba(255, 255, 255, 0.1)`, `backdrop-blur: 8px`, radius `16px`.

### 4.2 Dashboard Screen Layout
* **Sidebar (`sidebar`):**
  * Width: Fixed `260px`, `padding: 24px 16px`, background `#0F172A`.
  * Top Section:
    * Brand header: Logo (`28x32px`, `#4F46E5`), title `18px` white bold.
    * Workspace Switcher: Background `#1E293B`, border `1px solid #334155`, radius `8px`, `padding: 10px 12px`.
    * Navigation Items: Height `42px`, `padding: 10px 12px`, radius `8px`, gap `12px`.
      * *Active state:* Background `#4F46E5`, icon white, text white font-semibold.
      * *Inactive state:* Background transparent, icon `#94A3B8`, text `#94A3B8`, hover background `#1E293B` and text white.
  * Bottom Section:
    * User profile card: Background `#1E293B`, border `1px solid #334155`, radius `10px`, `padding: 12px`. Avatar `36x36px` rounded full, Name `13px` bold white, email `11px` muted slate, Logout button.
* **Main Content (`main-content`):**
  * `padding: 32px`, flex column layout, gap `24px`, background `#F8FAFC`.
  * **Header Bar (`header-bar`):**
    * Breadcrumb: `Dashboard / Overview` (`14px`, `#475569` and `#0F172A`).
    * Search Bar: Width `240px`, height `38px`, background `#FFFFFF`, border `#E2E8F0`, radius `8px`, shortcut badge `⌘K`.
    * Notification Button: `36x36px`, border `#E2E8F0`, red unread dot `8x8px` (`#EF4444`).
    * Date Filter Button: Height `36px`, border `#E2E8F0`, text `#4F46E5` semi-bold, calendar icon.
  * **KPI Ribbon (`kpi-row`):**
    * Grid: `grid-cols-4` (desktop), gap `16px`.
    * Card: `padding: 24px`, background `#FFFFFF`, border `1px solid #E2E8F0`, radius `12px`, shadow card.
    * Top row: Title (`14px` medium `#475569`), Icon container (`40x40px`, `#EEF2FF`, radius `8px`).
    * Bottom row: Value (`28px` bold `#0F172A`), Delta pill (`padding: 4px 8px`, radius `6px`, `11px` semi-bold).
  * **Charts Row (`charts-row`):**
    * Height: Fixed `380px`, gap `24px`.
    * Left Card (Area Chart): Flex-1, title *"User Engagement Trends"*, timeframe tabs (`7d`, `30d` active, `90d`).
    * Right Card (Donut Chart): Fixed `420px` width, title *"Traffic by Source"*, donut diameter `140px`, side legend items.
  * **Activity Table Card (`table-card`):**
    * Background `#FFFFFF`, border `1px solid #E2E8F0`, radius `12px`, `padding: 24px`, shadow card.
    * Data Table: Headers uppercase `12px` font-semibold `#475569`, border bottom `1px solid #E2E8F0`.
    * Rows: `padding: 14px 8px`, avatar `32x32px`, user name `14px` font-semibold, status pill (`padding: 4px 10px`, radius `100px`).
    * Pagination Footer: Range count `13px` `#475569`, buttons border `#E2E8F0`, text `#4F46E5`.
