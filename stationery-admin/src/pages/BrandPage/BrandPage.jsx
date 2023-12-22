import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useState } from "react";
//
import { axiosGet, axiosJWT, endpoints } from "../../utils/httpRequest";
import { selectAccessToken, selectRefreshToken } from "../../redux/selectors";
import ListBrand from "./ListBrand";
import NewBrand from "../../components/NewBrand";

export default function BrandPage() {
	const [brandData, setBrandData] = useState(null);

	const accessToken = useSelector(selectAccessToken);
	const refreshToken = useSelector(selectRefreshToken);
	const dispatch = useDispatch();
	const brandsState = useQuery({
		queryKey: ["brands"],
		queryFn: async () => {
			try {
				const res = await axiosGet(endpoints.brands);
				return res;
			} catch (error) {
				console.log(error);
				return Promise.reject(error);
			}
		},
		staleTime: 3 * 60 * 1000,
	});

	let brands = [];
	if (brandsState.isSuccess && brandsState.data.success) {
		brands = brandsState.data.data;
	}

	// modal handlers
	const openModal = (category) => {
		setBrandData(category);
	};

	const closeModal = () => {
		setBrandData(null);
	};

	const handleInserted = () => {
		brandsState.refetch();
	};
	const handleDelete = async (id) => {
		if (confirm("Do you want tot delete?") == true) {
			const toastId = toast.loading("processing!");
			const jwt = axiosJWT(accessToken, refreshToken, dispatch);
			try {
				const res = await jwt.delete(endpoints.brandParam + id, {
					headers: {
						Authorization: "Bearer " + accessToken,
					},
				});
				if (res.data.success) {
					brandsState.refetch();
					toast.update(toastId, {
						render: "delete successfully!",
						type: "success",
						closeButton: true,
						autoClose: 1000,
						isLoading: false,
					});
				}
			} catch (error) {
				console.log(error);
				toast.update(toastId, {
					render: error.response?.data.message || "can not delete!",
					type: "error",
					closeButton: true,
					autoClose: 5000,
					isLoading: false,
				});
			}
		}
	};

	return (
		<>
			{/* Modal */}
			<div
				className="modal fade"
				id="newProductModal"
				tabIndex={-1}
				aria-labelledby="newProductModalLabel"
				aria-hidden="true">
				<div className="modal-dialog modal-dialog-scrollable">
					<div className="modal-content bg-light">
						<div className="modal-header">
							<h5 className="modal-title" id="newProductModalLabel">
								Insert new brand
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							/>
						</div>
						<div className="modal-body">
							<NewBrand onInserted={handleInserted} />
						</div>
					</div>
				</div>
			</div>
			{/* update */}
			{brandData && (
				<>
					<div className="modal-backdrop fade show" />
					<div
						onClick={closeModal}
						className="modal fade show"
						id="newProductModal"
						tabIndex={-1}
						aria-labelledby="newProductModalLabel"
						aria-modal="true"
						role="dialog"
						style={{ display: "block" }}>
						<div
							className="modal-dialog modal-dialog-scrollable"
							// to closeModal
							onClick={(e) => {
								e.stopPropagation();
							}}>
							<div className="modal-content bg-light">
								<div className="modal-header">
									<h5 className="modal-title" id="newProductModalLabel">
										Update brand
									</h5>
									<button
										type="button"
										onClick={closeModal}
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Close"
									/>
								</div>
								<div className="modal-body">
									<NewBrand onInserted={handleInserted} brandData={brandData} isUpdate />
								</div>
							</div>
						</div>
					</div>
				</>
			)}
			<div className="bg-light rounded h-100 p-4">
				<div className="mb-4 d-flex justify-content-between align-items-center">
					<h5 className="mb-0">List Brand</h5>
					{/* Button trigger modal */}
					<button
						type="button"
						className="btn btn-primary"
						data-bs-toggle="modal"
						data-bs-target="#newProductModal">
						Add brand
					</button>
				</div>
				<ListBrand brands={brands} onDelete={handleDelete} onCategoryClick={openModal} />
			</div>
		</>
	);
}
