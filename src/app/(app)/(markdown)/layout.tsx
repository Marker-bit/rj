export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>
        {`
      h1 {
        font-size: 2em;
        font-weight: 700;
      }
      h2 {
        font-size: 1.8em;
        font-weight: 700;
      }
      h3 {
        font-size: 1.6em;
        font-weight: 700;
      }
      h4 {
        font-size: 1.4em;
        font-weight: 700;
      }
      h5 {
        font-size: 1.2em;
        font-weight: 700;
      }
      `}
      </style>
      {children}
    </>
  )
}
