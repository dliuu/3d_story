export class HTMLPanelController {
  constructor() {
    this.panels = [...document.querySelectorAll('.story-panel')]
    this.navDots = [...document.querySelectorAll('#floor-nav .nav-dot')]
    this.onNavClick = null

    this.navDots.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        if (this.onNavClick) this.onNavClick(i)
      })
    })
  }

  setActivePanel(index) {
    this.panels.forEach((p, i) => p.classList.toggle('active', i === index))
    this.navDots.forEach((b, i) => b.classList.toggle('active', i === index))
  }
}
