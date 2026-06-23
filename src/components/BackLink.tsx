import './BackLink.css'

export const BackLink = () => (
  <a
    className="back-link"
    href="https://devgroup.se#projects"
    aria-label="Back to DevGroup website"
  >
    <span className="back-link-arrow" aria-hidden="true">←</span>
    DevGroup.se
  </a>
)
