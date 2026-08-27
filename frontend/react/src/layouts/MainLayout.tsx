import HeaderMenu from "../components/HeaderMenu"

export default function MainLayout(props) {
  return (
    <>
      <HeaderMenu />
      <div className="flex justify-center">
        <div className="justify-between py-2 sm:px-16 max-w-[1920px] w-full">
          <main>
            { props.children }
          </main>
        </div>
      </div>
    </>
  )
}