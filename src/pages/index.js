import React from "react"
import { graphql } from "gatsby"
import * as moment from "moment"

import Layout from "../components/layout"
import SEO from "../components/seo"

const group = events =>
  events.reduce((acc, e) => {
    const day = e.day

    if (!acc[day]) {
      acc[day] = []
    }

    acc[day].push(e)

    return acc
  }, {})

export default ({ data }) => {
  const events = data.allEvents.edges.map(e => e.node)
  const grouped = group(events)

  const days = Object.keys(grouped)
    .sort()
    .map(day => (
      <React.Fragment key={day}>
        <h2>
          <div>{moment(day).format("dddd")}</div>
          <div className="secondary">{moment(day).format("MMM D")}</div>
        </h2>
        <div className="day">
          {grouped[day].map(e => (
            <div className="event" key={e.id}>
              <div>{e.summary}</div>
              <div className="secondary location">{e.location}</div>
            </div>
          ))}
        </div>
      </React.Fragment>
    ))

  return (
    <Layout>
      <SEO title="Home" />
      {days}
    </Layout>
  )
}

export const query = graphql`
  query {
    allEvents(sort: { fields: start }) {
      edges {
        node {
          day
          description
          id
          location
          start
          summary
          url
        }
      }
    }
  }
`
