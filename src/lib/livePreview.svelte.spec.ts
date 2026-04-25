import { ready, subscribe, unsubscribe } from '@payloadcms/live-preview'
import { flushSync, mount, unmount } from 'svelte'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import LivePreviewWrapper from './test/LivePreviewWrapper.svelte'

vi.mock('@payloadcms/live-preview', () => ({
  ready: vi.fn(),
  subscribe: vi.fn(),
  unsubscribe: vi.fn(),
}))

const TEST_SERVER_URL = 'https://cms.zapal.tech'
const initialData = { title: 'Initial Title', body: 'Initial Body' }

let target: HTMLDivElement
let component: ReturnType<typeof mount> | undefined

function mountWrapper(props: { serverURL: string; initialData: Record<string, unknown> }) {
  component = mount(LivePreviewWrapper, { target, props })
  flushSync()
}

function getTestId(id: string): string | null | undefined {
  return target.querySelector(`[data-testid="${id}"]`)?.textContent
}

beforeEach(() => {
  target = document.createElement('div')
  document.body.appendChild(target)
  vi.mocked(subscribe).mockReturnValue('subscription-token' as unknown as ReturnType<typeof subscribe>)
})

afterEach(() => {
  if (component) {
    unmount(component)
    component = undefined
  }
  target.remove()
  vi.clearAllMocks()
})

describe('createLivePreview', () => {
  it('renders initialData before any live update', () => {
    mountWrapper({ serverURL: TEST_SERVER_URL, initialData })

    expect(getTestId('data')).toBe(JSON.stringify(initialData))
  })

  it('starts with isLoading as true', () => {
    mountWrapper({ serverURL: TEST_SERVER_URL, initialData })

    expect(getTestId('is-loading')).toBe('true')
  })

  it('calls ready() with serverURL on mount', () => {
    mountWrapper({ serverURL: TEST_SERVER_URL, initialData })

    expect(ready).toHaveBeenCalledWith({ serverURL: TEST_SERVER_URL })
  })

  it('calls subscribe with the correct options on mount', () => {
    mountWrapper({ serverURL: TEST_SERVER_URL, initialData, apiRoute: '/api/v2', depth: 3 })

    expect(subscribe).toHaveBeenCalledOnce()
    expect(subscribe).toHaveBeenCalledWith(
      expect.objectContaining({ serverURL: TEST_SERVER_URL, initialData, apiRoute: '/api/v2', depth: 3 }),
    )
  })

  it('updates data when the subscription callback is invoked', () => {
    let capturedCallback: ((data: Record<string, unknown>) => void) | undefined
    vi.mocked(subscribe).mockImplementation(({ callback }) => {
      capturedCallback = callback
      return 'subscription-token' as unknown as ReturnType<typeof subscribe>
    })

    mountWrapper({ serverURL: TEST_SERVER_URL, initialData })

    flushSync(() => capturedCallback!({ title: 'Updated Title', body: 'Updated Body' }))

    expect(getTestId('data')).toBe(JSON.stringify({ title: 'Updated Title', body: 'Updated Body' }))
  })

  it('sets isLoading to false when the subscription callback is invoked', () => {
    let capturedCallback: ((data: Record<string, unknown>) => void) | undefined
    vi.mocked(subscribe).mockImplementation(({ callback }) => {
      capturedCallback = callback
      return 'subscription-token' as unknown as ReturnType<typeof subscribe>
    })

    mountWrapper({ serverURL: TEST_SERVER_URL, initialData })

    flushSync(() => capturedCallback!(initialData))

    expect(getTestId('is-loading')).toBe('false')
  })

  it('calls unsubscribe with the subscription token on cleanup', () => {
    mountWrapper({ serverURL: TEST_SERVER_URL, initialData })

    unmount(component!)
    component = undefined

    expect(unsubscribe).toHaveBeenCalledWith('subscription-token')
  })

  it('reflects the last value after multiple callback invocations', () => {
    let capturedCallback: ((data: Record<string, unknown>) => void) | undefined
    vi.mocked(subscribe).mockImplementation(({ callback }) => {
      capturedCallback = callback
      return 'subscription-token' as unknown as ReturnType<typeof subscribe>
    })

    mountWrapper({ serverURL: TEST_SERVER_URL, initialData })

    flushSync(() => {
      capturedCallback!({ title: 'First Update' })
      capturedCallback!({ title: 'Second Update' })
    })

    expect(getTestId('data')).toBe(JSON.stringify({ title: 'Second Update' }))
  })
})
