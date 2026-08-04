const PALETTE = {
  purple: { bg: '#EEEDFE', fg: '#534AB7' },
  teal: { bg: '#E1F5EE', fg: '#0F6E56' },
  blue: { bg: '#E6F1FB', fg: '#185FA5' },
  coral: { bg: '#FAECE7', fg: '#993C1D' },
}

export default function IconBadge({ icon: Icon, color = 'purple', size = 30 }) {
  const c = PALETTE[color] || PALETTE.purple
  return (
    <div style={{ width: size, height: size, backgroundColor: c.bg }} className="rounded-lg flex items-center justify-center shrink-0">
      <Icon size={size * 0.5} strokeWidth={2.2} style={{ color: c.fg }} />
    </div>
  )
}