import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { MIKU_LAYERS } from './miku-layers.js'

const SCENE = 'snow-miku'

// 낮은 얼음빛 하늘, 밤은 눈 내리는 겨울밤
const { theme, problems } = makeColors({
  label: 'Snow Miku',
  roles: { accent: '#39c5bb', danger: '#d0455a', success: '#3f9e6e', warning: '#c48a1c', pro: '#7a6fd0' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e3eff6',
        'surface-1': '#ebf5fa',
        'surface-2': '#f4fafd',
        'text-primary': '#12303d',
        'text-secondary': '#32566a',
        'text-muted': '#4b6a7a',
      },
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0e1b24',
        'surface-1': '#14242f',
        'surface-2': '#1a2d3a',
        'surface-3': '#1f3442',
        'text-primary': '#e8f5fb',
        'text-secondary': '#bcd6e2',
        'text-muted': '#93b3c2',
      },
    },
  },
})

// 매번 같은 그림이 나오도록 고정 씨앗의 의사 난수
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function sceneSvg(): string {
  const r = rng(39)
  const W = 1920
  const H = 1080
  let flakes = ''
  for (let i = 0; i < 60; i++) {
    const x = Math.round(r() * W)
    const size = (1.5 + r() * 3.5).toFixed(1)
    const dur = (9 + r() * 14).toFixed(1)
    const delay = (-r() * 20).toFixed(1)
    const dx = Math.round((r() - 0.5) * 120)
    const op = (0.55 + r() * 0.45).toFixed(2)
    flakes += `<circle class="f" cx="${x}" cy="-20" r="${size}" opacity="${op}" style="--dx:${dx}px;animation-duration:${dur}s;animation-delay:${delay}s"/>`
  }
  // 눈송이 결정과 미쿠색 음표가 함께 천천히 떨어진다
  const glyphs = ['❄', '❅', '❆', '♪', '♫']
  let crystals = ''
  for (let i = 0; i < 18; i++) {
    const x = Math.round(r() * W)
    const g = glyphs[i % glyphs.length]
    const isNote = g === '♪' || g === '♫'
    const fs = Math.round(isNote ? 26 + r() * 14 : 22 + r() * 22)
    const dur = (18 + r() * 16).toFixed(1)
    const delay = (-r() * 30).toFixed(1)
    const dx = Math.round((r() - 0.5) * 200)
    crystals += `<text class="f ${isNote ? 'n' : 'c'}" x="${x}" y="-40" font-size="${fs}" style="--dx:${dx}px;animation-duration:${dur}s;animation-delay:${delay}s">${g}</text>`
  }
  let stars = ''
  for (let i = 0; i < 60; i++) {
    const x = Math.round(r() * W)
    const y = Math.round(r() * 600)
    const d = (2 + r() * 4).toFixed(1)
    stars += `<circle class="tw" cx="${x}" cy="${y}" r="${(0.8 + r() * 1.6).toFixed(1)}" style="animation-duration:${d}s;animation-delay:${(-r() * 4).toFixed(1)}s"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<style>
.f{animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}
circle.f{fill:#ffffff}
.c{fill:#ffffff;opacity:.85;font-family:'Segoe UI Symbol',sans-serif}
.n{fill:#39c5bb;opacity:.8;font-family:'Segoe UI Symbol',sans-serif}
@keyframes fall{from{transform:translate(0,0)}to{transform:translate(var(--dx),${H + 120}px)}}
.rb{animation:sway 16s ease-in-out infinite alternate}
@keyframes sway{from{transform:translateY(-25px)}to{transform:translateY(35px)}}
.s0{stop-color:#a9d4ec}.s1{stop-color:#e3f2fa}.s2{stop-color:#ffffff}
.h1{fill:#d6ecf7}.h2{fill:#eef8fd}.h3{fill:#ffffff}
.stars,.moon{opacity:0}
.tw{fill:#ffffff;animation:twinkle 3s ease-in-out infinite alternate}
@keyframes twinkle{from{opacity:.2}to{opacity:1}}
@media (prefers-color-scheme: dark){
.s0{stop-color:#07121f}.s1{stop-color:#12304a}.s2{stop-color:#28597a}
.h1{fill:#1c3d55}.h2{fill:#2a5571}.h3{fill:#3d6f8e}
.stars,.moon{opacity:1}.glow{opacity:.35}
}
</style>
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" class="s0"/><stop offset="0.55" class="s1"/><stop offset="1" class="s2"/>
</linearGradient>
<linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#39c5bb" stop-opacity="0"/><stop offset="0.5" stop-color="#39c5bb" stop-opacity="0.4"/><stop offset="1" stop-color="#8fd3f4" stop-opacity="0"/>
</linearGradient>
<radialGradient id="glow" cx="0.8" cy="0.16" r="0.35">
<stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<g class="stars">${stars}</g>
<rect class="glow" width="${W}" height="${H}" fill="url(#glow)"/>
<circle class="moon" cx="1536" cy="170" r="46" fill="#f4fbff"/>
<path class="rb" d="M0 250 C 420 150, 900 370, 1920 200" stroke="url(#ribbon)" stroke-width="70" fill="none"/>
<path class="h1" d="M0 820 C 300 740, 620 760, 960 800 C 1300 840, 1600 730, 1920 770 L1920 1080 L0 1080 Z"/>
<path class="h2" d="M0 900 C 380 840, 760 930, 1180 880 C 1500 845, 1720 900, 1920 870 L1920 1080 L0 1080 Z"/>
<path class="h3" d="M0 990 C 500 950, 1100 1010, 1920 965 L1920 1080 L0 1080 Z"/>
${flakes}
${crystals}
</svg>`
}

// 맥북 앞에 앉아 일하는 픽셀 Clawd (14px 격자, 미쿠 왼쪽)
const cell = (x: number, y: number, w: number, h: number) => `<rect x="${x * 14}" y="${y * 14}" width="${w * 14}" height="${h * 14}"/>`
const LAPTOP_CLAWD = `<g id="clawd" transform="translate(1360 680)">
<ellipse cx="112" cy="122" rx="135" ry="12" fill="#000" opacity=".2"/>
<g fill="#d97757">${cell(2, 0, 12, 6)}${cell(0, 3, 2, 2)}${cell(14, 3, 2, 2)}</g>
<g fill="#1a1a1a">${cell(4, 1, 1, 2)}${cell(11, 1, 1, 2)}</g>
<rect x="40" y="56" width="144" height="56" rx="6" fill="#cfd8df" stroke="#8a99a6" stroke-width="2"/>
<rect x="44" y="60" width="136" height="5" rx="2" fill="#eef3f7"/>
<circle cx="112" cy="86" r="8" fill="#eef3f7" opacity=".8"/>
<rect x="24" y="110" width="176" height="10" rx="4" fill="#aab6c0"/>
</g>`

export const SVG = sceneSvg()
// 미쿠와 Clawd 는 창 오른쪽에 붙여, 창이 좁아져도 잘리지 않고 입력창에도 가리지 않게 한다
export const CLAWD_LAYER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMaxYMid meet">
<ellipse cx="1748" cy="800" rx="150" ry="14" fill="#000" opacity=".2"/>${LAPTOP_CLAWD}</svg>`

const LOOK: ThemeSetArgs = {
  colors: theme,
  // 배경이 또렷이 비치게 거의 투명하게: 색조가 어두운 모드에 안 맞으면 앱이 버리므로 surface-0 색을 쓴다
  backdrop: { scene: SCENE, glass: { blur: 2, tint: '#0e1b24', opacity: 0.15 } },
}

// 설치본은 배경을 건 이름이 '이름@마켓' 으로 올 수 있어 앞부분만 맞춰 본다
export const isMine = (setter: string, own: string) => setter.split('@')[0] === own.split('@')[0]
let lastAsked = '(아직 없음)'
let isOn = true

export const register: Register = (on) => {
  // 배경은 reload·--resume 에서 유지되지 않아 세션 시작마다 다시 건다
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find((line) => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) $.ui.toast(unpainted)
    // 화면이 붙기 전이면 isDrawn 이 false 지만, 설정은 남아 붙는 화면이 그린다
    await $.theme.set(LOOK)
    await $.command.register({ name: 'snow-off', description: '눈 테마 끄기' })
    await $.command.register({ name: 'snow-on', description: '눈 테마 다시 켜기' })
    return next(e)
  })

  // 세션 시작 때 건 배경을 새 화면 코드가 첫 그리기에서 놓친다: 같은 설정을 다시 걸면 무시되므로 껐다 켠다
  on('session.attach', async ($, e, next) => {
    const done = await next(e)
    if (isOn && (e.surface === 'desktop' || e.surface === 'mobile')) {
      await $.theme.clear()
      await $.theme.set(LOOK)
    }
    return done
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    lastAsked = e.props.plugin
    if (!isMine(e.props.plugin, $.plugin.name) || e.props.scene !== SCENE) return next(e)
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    const { Box, Svg } = $.ui.resolve(e)
    return Box({
      children: [
        Svg({ source: SVG, alt: '눈 내리는 겨울밤 언덕', isInteractive: true }),
        ...MIKU_LAYERS.map((source) => Svg({ source, alt: '2019 스노우 프린세스 유키미쿠', isInteractive: true })),
        Svg({ source: CLAWD_LAYER, alt: '맥북으로 일하는 Clawd', isInteractive: true }),
      ],
    })
  })

  on('command.run', { command: 'snow-off' }, async ($) => {
    isOn = false
    await $.theme.clear()
    return { text: '눈 테마를 껐어요' }
  })

  on('command.run', { command: 'snow-on' }, async ($) => {
    isOn = true
    await $.theme.clear()
    const set = await $.theme.set(LOOK)
    const names = `(모드 이름 ${$.plugin.name}, 마지막 배경 요청 ${lastAsked})`
    return { text: set.isDrawn ? `눈 테마를 켰어요 ${names}` : `켜지 못했어요: ${set.reason} ${names}` }
  })
}
