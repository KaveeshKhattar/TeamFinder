import { IndividualCardProps } from "../../../types";

const IndividualCard: React.FC<IndividualCardProps> = ({ individual }) => {
    return (
        <div className="flex mt-4 justify-between" key={individual.id}>
            <p>
                {individual.firstName} {individual.lastName}
            </p>
            <p>{individual.email}</p>
        </div>
    )
}

export default IndividualCard;