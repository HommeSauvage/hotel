import colors from '../../theme/colors'

export interface Props {
  children: import('react').ReactNode;
}

const Global = ({ children }: Props) => (
  <>
    {children}

    <style jsx global>{`
      html {
        line-height: 1.15;
        -webkit-text-size-adjust: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }
      body {
        position: relative;
        min-height: 100%;
        margin: 0;
        line-height: 1.65;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
          'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
          'Helvetica Neue', sans-serif;
        font-size: 16px;
        font-weight: 400;
        min-width: 320px;
        font-feature-settings: 'kern';
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        scroll-behavior: smooth;
      }
      html,
      body {
        background-color: ${colors.white};
        color: #111;
      }
      ::selection {
        background-color: ${colors.primary};
        color: ${colors.white};
      }
      [role='grid']:focus {
        outline: none;
      }
      svg {
        text-rendering: optimizeLegibility;
      }
      h1,
      h2,
      h3 {
        margin: 0;
      }
      a {
        color: ${colors.primary};
        text-decoration: underline;
        text-decoration: none;
        transition: color 0.2s ease;
      }
      a:hover {
        color: ${colors.accent};
      }

      .x-visible {
        display: none;
      }

      @media (min-width: 768px) {
        .x-visible {
          display: block;
        }

        .x-hidden {
          display: none;
        }
      }
    `}</style>
  </>
)

export default Global
