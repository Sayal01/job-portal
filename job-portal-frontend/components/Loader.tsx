const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Loader;
