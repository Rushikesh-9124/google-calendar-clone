// helpers for expanding recurring events into instances
import  { rrulestr } from 'rrule';

function expandRecurringEvent(ev, fromDate, toDate) {
  // returns array of instances { start, end, instanceId, baseEvent }
  if (!ev.recurrence || !ev.recurrence.rrule) return [];

  // Build rule string with DTSTART
  // rrulestr expects DTSTART in UTC format without colons in the string block
  // We'll use ISO but rrulestr handles RFC-ish strings; ensure DTSTART matches ev.start
  const dtStartISO = ev.start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  // Construct a string that rrulestr can parse
  const rruleText = `DTSTART:${dtStartISO}\nRRULE:${ev.recurrence.rrule}`;
  let rule;
  try {
    rule = rrulestr(rruleText);
  } catch (e) {
    console.error('rrule parse error', e);
    return [];
  }
  const between = rule.between(fromDate, toDate, true);
  const duration = new Date(ev.end) - new Date(ev.start);
  return between.map(dt => {
    const start = dt;
    const end = new Date(dt.getTime() + duration);
    const instanceId = `${ev._id.toString()}_${start.toISOString()}`;
    return {
      ...ev,
      start,
      end,
      instanceId,
      isRecurring: true,
      baseEventId: ev._id
    };
  });
}

module.exports = { expandRecurringEvent };
