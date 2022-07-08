import Person from "./Person";
const RelationFields = ({
    data,
    label,
    gotoRouter,
    compare
}) => {
    const relations = (Array.isArray(data)) ? data : [data];
    return <div className={compare ? `` : `mb-3`}>
        <div className="flex items-start">
            {label ? <p className="font-light mt-0.5 mb-0 w-20 text-gray-300 text-xs pr-4 text-right">{label}</p> : null}
            <div className="flex-grow mb-2">
                {relations.map((profile, key) => {
                    if (compare) {
                        return <div className="grid grid-cols-2" key={key}>
                            <div className="border-r border-gray-600 pl-4 pr-2">
                                <Person compare={compare} Item={profile} gotoRouter={gotoRouter} />
                            </div>
                            <div className="px-3">
                                {profile.comparePerson ? <Person compare={compare} Item={profile.comparePerson} gotoRouter={gotoRouter} /> : null}
                            </div>
                        </div>
                    }
                    return <Person key={key} compare={compare} Item={profile} gotoRouter={gotoRouter} />
                })}
            </div>
        </div>
    </div>
}
export default RelationFields;