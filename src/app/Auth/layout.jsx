const Layout = ({ children }) => {
  return (
    <div className="bg-gradient-to-tr from-gray-100 via-white to-gray-200 min-h-screen">
      {/* <Navbar /> */}
      <main className="flex items-center justify-center min-h-screen">{children}</main>
    </div>
  );
};

export default Layout;
