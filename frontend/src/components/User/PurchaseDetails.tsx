import { useParams } from "react-router-dom"

const PurchaseDetails = () => {

    const { id } = useParams()
    alert(id)
    return (
        <div>

        </div>
    )
}

export default PurchaseDetails
