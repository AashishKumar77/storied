const Header = ({
    profile
}) => {
    return <div className="px-4 sm:px-3.5 border-b border-gray-600 mt-1 pb-3.5">
        {profile.name ? <h2 id="slide-over-heading" className="text-2xl font-bold text-white mb-0 pb-0">
            <span>
                {profile.name && profile.name.value && profile.name.value.firstName}
            </span>
            <span className="inline-block ml-1">
                {profile.name && profile.name.value && profile.name.value.lastName}
            </span>
        </h2> : null}
        <p className="font-light text-sm mt-0.5 text-gray-300 mb-0">
            {profile.namePlace || ""}
        </p>
    </div>
}
export default Header;