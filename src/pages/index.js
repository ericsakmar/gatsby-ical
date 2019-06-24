import React from "react"
import { graphql } from "gatsby"
import * as moment from "moment"

import Layout from "../components/layout"
import SEO from "../components/seo"

export default ({ data }) => {
  const events = data.allEvents.edges.map(e => e.node)

  const grouped = events.reduce((acc, e) => {
    const day = e.day

    if (!acc[day]) {
      acc[day] = []
    }

    acc[day].push(e)

    return acc
  }, {})

  const days = Object.keys(grouped)
    .sort()
    .map(day => (
      <div key={day}>
        <h2>{moment(day).format("dddd, MMMM Do")}</h2>
        <ul>
          {grouped[day].map(e => (
            <li key={e.id}>{e.summary}</li>
          ))}
        </ul>
      </div>
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
