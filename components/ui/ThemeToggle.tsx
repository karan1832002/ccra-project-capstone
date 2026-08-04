'use client'

export default function ThemeToggle() {
  const toggle = () => {
    // Flip the class, capture the resulting state
    const isDark = document.documentElement.classList.toggle('dark')

    // Persist choice for future visits
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  return (
    <button onClick={toggle} className="btn-primary">
      Toggle theme
    </button>
  )
}