# LegalChainFrontend

## Feature Overview

- **Contract Generator:** Create, preview, and download legal contracts.
- **Dashboard:** Upload, list, analyze, and delete documents.
- **Document Analysis:** AI-powered document analysis.
- **NDA Generator:** Generate and review NDAs, download as PDF/TXT.
- **Document Summary:** Get AI-generated summaries for uploaded documents.
- **Document Comparison:** Compare two documents for differences.
- **Translation Service:** Translate documents into multiple languages.
- **Legal Review:** AI-powered legal review of uploaded documents.
- **Document Management:** Upload, preview, and delete documents by category.

## Usage Instructions

- Navigate to each feature via the sidebar or dashboard.
- Upload documents using the provided forms.
- Click action buttons to analyze, summarize, compare, translate, or review documents.
- Download results as PDF or TXT where available.
- Use the dashboard and management pages to organize and delete documents.

## API Endpoints

- `/api/ai/generateContract` - Generate contracts
- `/api/ai/analyze` - Analyze documents
- `/api/ai/generateNDA` - Generate NDAs
- `/api/ai/review` - Review NDAs/contracts
- `/api/ai/summarizeDocument` - Summarize documents
- `/api/ai/compareDocuments` - Compare documents
- `/api/ai/translate` - Translate documents
- `/api/ai/legalReview` - Legal review
- `/api/docs/upload` - Upload documents
- `/api/docs/delete/[id]` - Delete documents
- `/api/docs` - List documents

## Accessibility & Error Handling

- All forms and buttons include `aria-labels` for screen reader support.
- User-friendly error and success messages are shown for all actions.
- Keyboard navigation is supported throughout the app.

## Manual Testing Checklist

- [ ] Upload documents in all feature pages
- [ ] Run analysis, summary, comparison, translation, and review
- [ ] Download results as PDF/TXT
- [ ] Delete documents and confirm removal
- [ ] Test navigation and keyboard accessibility
- [ ] Verify error messages for failed actions
- [ ] Confirm success messages for completed actions

---

For more details, see individual page documentation or contact the development team.
