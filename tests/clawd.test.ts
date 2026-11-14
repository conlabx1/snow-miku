import { expect, test } from 'claude-code/testing'

import { CLAWD_LAYER, SVG } from '../hooks/register.ts'
import { MIKU_LAYERS } from '../hooks/miku-layers.js'

const LIMIT = 131072

test('배경의 모든 층이 앱의 Svg 한 장 한도 안에 든다', () => {
  for (const layer of [SVG, ...MIKU_LAYERS, CLAWD_LAYER]) expect(layer.length).toBeLessThan(LIMIT)
})

test('미쿠와 맥북 Clawd 는 창 오른쪽에 붙는 층에 그린다', () => {
  expect(MIKU_LAYERS.length).toBeGreaterThan(0)
  for (const layer of [...MIKU_LAYERS, CLAWD_LAYER]) expect(layer).toContain('preserveAspectRatio="xMaxYMid meet"')
  expect(CLAWD_LAYER).toContain('id="clawd"')
  expect(SVG).not.toContain('id="clawd"')
})
