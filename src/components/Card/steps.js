// Components
import Typography from "../Typography";

export const steps = [
    {
        selector: '.card-first-generation',
        content: () => (
            <>
                <div className="flex items-center space-x-40">
                    <Typography
                        size={20}
                        text="brand-color"
                        weight="bold"
                        tkey="pedigree.tooltip.heading"
                    >                       
                    </Typography>
                </div>

                <div className="mt-2">
                    <Typography
                        size={14}
                        text="secondary"
                        tkey="pedigree.tooltip.desc"
                    >                       
                    </Typography>
                </div>

                <div className="arrow-down"></div>
            </>
        ),
    }
];