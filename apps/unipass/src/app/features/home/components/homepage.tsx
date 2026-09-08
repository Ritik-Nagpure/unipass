
import Footer from './footer'

const HomePage = () => {
    return (
        <div>
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
                <div className="w-full md:w-7/10 p-4 md:p-8 bg-gray-50">
                    <h1 className="text-3xl font-bold">Welcome Home</h1>
                    <p className="mt-4">Left content area - 70% on web</p>
                </div>
                <div className="w-full md:w-3/10 p-4 md:p-8 bg-white border-t md:border-l md:border-t-0 border-gray-200">
                    <h2 className="text-2xl font-semibold">Auth</h2>
                    <p className="mt-4">Login/Signup form here</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage