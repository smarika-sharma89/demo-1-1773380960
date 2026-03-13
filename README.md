# Approvals — Varicon Prototype

Generated from a Varicon discovery session.

## What this demonstrates
The prototype should focus on the highest-priority issue: multi-phase bill approval status visibility and filtering. It should display a bills list view with enhanced status indicators that clearly show which approval phase each bill is in (e.g. 'Awaiting Approval', 'Awaiting Second Approval', 'Awaiting Final Approval', 'Fully Approved'). Each bill row should show the list of required approvers with a visual indicator (e.g. checkmark, pending icon) next to each approver's name showing whether they have approved. The approval filter at the top of the screen should allow filtering by a specific approver and by approval phase, correctly returning only bills where that approver's action is still pending. A secondary section of the prototype should show a Day Works docket detail view in 'submitted' status, including an internal notes/audit log panel where users can add timestamped notes that are visible to the team but do not appear on the printed docket. This covers the two most critical and actionable items identified in the session.

## Features shown
- Additional granular approval statuses (e.g. 'Awaiting Second Approval', 'Awaiting Final Approval') to distinguish phases within multi-step approval workflows
- Fix approval filter to correctly filter bills by a specific pending approver when multiple approvers are assigned
- Ability to directly edit the GST figure on a bill so subtotal and GST match the physical invoice without altering the subtotal
- Improved and reliable automatic bill syncing with Xero, reducing the need for manual sync triggers
- WBS copy/duplicate functionality to replicate WBS assignments across all lines of a bill with the ability to amend individual lines
- Lost time tracking and reporting for stand-down hours
- Ability to add internal notes or audit log entries to a submitted Day Works docket without the note appearing on the docket itself
- In-app visibility, upload, and amendment of Day Works charge rates by users without vendor intervention
- In-app approval status visibility dashboard or indicator to replace reliance on email notifications

## Running locally
```
npm install
npm run dev
```

## Note
This is a prototype with mock data. No real API calls are made.
