import { isDocumentEvent, ready } from '@payloadcms/live-preview'
import { flushSync, mount, unmount } from 'svelte'
import { afterEach, describe, expect, it, vi } from 'vitest'

import RefreshRouteOnSave from './RefreshRouteOnSave.svelte'

vi.mock('@payloadcms/live-preview', () => ({
  isDocumentEvent: vi.fn(),
  ready: vi.fn(),
}))

const TEST_SERVER_URL = 'http://cms.local'

let component: ReturnType<typeof mount> | undefined

function mountComponent(props: object) {
  const target = document.createElement('div')
  component = mount(RefreshRouteOnSave, { target, props })
  flushSync()
}

afterEach(() => {
  if (component) {
    unmount(component)
    component = undefined
  }
  vi.clearAllMocks()
})

describe('RefreshRouteOnSave', () => {
  it('calls ready() once on mount with serverURL', () => {
    mountComponent({ serverURL: TEST_SERVER_URL, refresh: vi.fn() })

    expect(ready).toHaveBeenCalledOnce()
    expect(ready).toHaveBeenCalledWith({ serverURL: TEST_SERVER_URL })
  })

  it('calls refresh() once on mount', () => {
    const refresh = vi.fn()
    mountComponent({ serverURL: TEST_SERVER_URL, refresh })

    expect(refresh).toHaveBeenCalledOnce()
  })

  it('calls refresh() when a matching document event is received', () => {
    vi.mocked(isDocumentEvent).mockReturnValue(true)
    const refresh = vi.fn()
    mountComponent({ serverURL: TEST_SERVER_URL, refresh })

    window.dispatchEvent(new MessageEvent('message', { data: {} }))

    expect(refresh).toHaveBeenCalledTimes(2)
  })

  it('does not call refresh() for non-matching document events', () => {
    vi.mocked(isDocumentEvent).mockReturnValue(false)
    const refresh = vi.fn()
    mountComponent({ serverURL: TEST_SERVER_URL, refresh })

    window.dispatchEvent(new MessageEvent('message', { data: {} }))

    expect(refresh).toHaveBeenCalledOnce()
  })

  it('removes the message listener on unmount', () => {
    vi.mocked(isDocumentEvent).mockReturnValue(true)
    const refresh = vi.fn()
    mountComponent({ serverURL: TEST_SERVER_URL, refresh })

    unmount(component!)
    component = undefined

    window.dispatchEvent(new MessageEvent('message', { data: {} }))

    expect(refresh).toHaveBeenCalledOnce()
  })

  it('passes the correct serverURL to isDocumentEvent', () => {
    vi.mocked(isDocumentEvent).mockReturnValue(false)
    const refresh = vi.fn()
    mountComponent({ serverURL: TEST_SERVER_URL, refresh })

    const event = new MessageEvent('message', { data: {} })
    window.dispatchEvent(event)

    expect(isDocumentEvent).toHaveBeenCalledWith(event, TEST_SERVER_URL)
  })

  it('accepts apiRoute and depth props without errors', () => {
    mountComponent({ serverURL: TEST_SERVER_URL, refresh: vi.fn(), apiRoute: '/api/v2', depth: 3 })

    expect(ready).toHaveBeenCalledOnce()
  })
})
