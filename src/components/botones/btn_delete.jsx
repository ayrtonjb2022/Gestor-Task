const deleteBtn = () => {
    return (
        <div className="flex justify-center items-center">
            <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M5 6l1 14h12l1-14M9 10v6m6-6v6" />
                </svg>
            </button>
        </div>

    )
}

export default deleteBtn