const fetch = require("node-fetch")
const ical = require("node-ical")
const moment = require("moment")

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions
  const { name, url } = configOptions

  const toNode = event => {
    return {
      ...event,
      id: createNodeId(`event-${event.uid}`),
      day: moment(event.start).format("YYYY-MM-DD"),
      parent: null,
      children: [],
      internal: {
        type: name,
        content: JSON.stringify(event),
        contentDigest: createContentDigest(event),
      },
    }
  }

  const start = moment().format("YYYY-MM-DD")
  const end = moment(start).add(2, "weeks")
  const response = await fetch(url)
  const raw = await response.text()
  const cal = ical.parseICS(raw)

  Object.values(cal)
    .map(toNode)
    .filter(e => moment(e.day).isSameOrAfter(start))
    .filter(e => moment(e.day).isSameOrBefore(end))
    .forEach(e => {
      createNode(e)
    })
}
