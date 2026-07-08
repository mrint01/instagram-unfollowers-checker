import { generateChecklistHtml } from './generateChecklistHtml.js'

export function generateResultsHtml(people) {
  return generateChecklistHtml({
    people,
    heading: `${people.length} account${people.length === 1 ? '' : 's'} that ${people.length === 1 ? "doesn't" : "don't"} follow you back`,
    subheading: "Check off accounts once you've unfollowed them. Progress is saved in this browser.",
    emptyMessage: 'Everyone you follow also follows you back.',
    showNames: false,
    showDates: true,
    storageKey: 'ig_unfollowers_checked_v1',
  })
}
