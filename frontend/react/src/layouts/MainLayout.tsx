import HeaderMenu from "../components/HeaderMenu"

export default function MainLayout(props) {
  return (
    <>
      <HeaderMenu />
      <main>
        { props.children }
      </main>
    </>
  )
}