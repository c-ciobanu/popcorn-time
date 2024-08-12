import { useState } from 'react'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { MetricsQuery, MetricsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, useMutation } from '@redwoodjs/web'

import NewMetricModal from './NewMetricModal/NewMetricModal'

export const QUERY: TypedDocumentNode<MetricsQuery, MetricsQueryVariables> = gql`
  query MetricsQuery {
    metrics {
      id
      name
      unit
      latestEntry {
        id
        value
        date
      }
    }
  }
`
const CREATE_METRIC = gql`
  mutation CreateMetricMutation($input: CreateMetricInput!) {
    createMetric(input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ metrics }: CellSuccessProps<MetricsQuery>) => {
  const [isOpen, setIsOpen] = useState(false)

  const [createMetric, { loading: createMetricLoading }] = useMutation(CREATE_METRIC, {
    onCompleted: () => {
      setIsOpen(false)
    },
    refetchQueries: [{ query: QUERY }],
  })

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Metric
        </button>

        <NewMetricModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={(data) =>
            createMetric({
              variables: {
                input: { ...data, entry: { ...data.entry, date: data.entry.date.toISOString().substring(0, 10) } },
              },
            })
          }
          isSubmitting={createMetricLoading}
        />
      </div>

      <ul className="divide-y divide-white">
        {metrics.map((metric) => (
          <li key={metric.id}>
            <Link
              to={routes.metric({ id: metric.id })}
              title={metric.name}
              className="flex items-center justify-between gap-6 py-4"
            >
              <p className="text-sm font-semibold text-gray-900">{metric.name}</p>

              <div className="flex shrink-0 flex-col items-end">
                <p className="text-sm leading-6 text-gray-900">
                  {metric.latestEntry.value} {metric.unit}
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  <time dateTime={metric.latestEntry.date}>{metric.latestEntry.date}</time>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
