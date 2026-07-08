import { generateChecklistHtml } from './generateChecklistHtml.js'

export function generatePendingHtml(people) {
  return generateChecklistHtml({
    people,
    heading: `${people.length} pending follow request${people.length === 1 ? '' : 's'}`,
    subheading: "Check off accounts as you cancel their request in the Instagram app. Progress is saved in this browser.",
    emptyMessage: 'No pending follow requests.',
    showNames: true,
    showDates: true,
    storageKey: 'ig_pending_requests_checked_v1',
  })
}
