import React, { useState, useEffect } from "react";

import NoData from "../../../../../common/noData/noData";
import Table from "../../../../../common/table/table";
import "../../../../../common/show modal/showModal.css";
import TableFilter from "../../../../../common/tableFilter/tableFilter";
import Loading from "../../../../../common/loading/loading";
import TableIcons from "../../../../../common/tableIcons/tableIcons";
import WrongMessage from "../../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import { Link } from "react-router-dom";

function DiscountFinalProduct(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [discountID, setDiscountID] = useState(props.discountIDInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [discountFinalProduct, setDiscountFinalProduct] = useState([]);
  const [
    totalDiscountFinalProductsLength,
    setTotalDiscountFinalProductsLength,
  ] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [newDiscountFinalProduct, setNewDiscountFinalProduct] = useState({
    client_id: clientID,
    company_id: companyID,
    discount_id: discountID,
    category_id: "",
    product_id: "",
    final_product_id: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // getDiscountFinalProduct
    const getDiscountFinalProduct = async () => {
      try {
        const url = `${base_url}/admin/company/accounting/discount-final-products/${discountID}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            console.log("res", res.data.data);
            setColumnsHeader(["Id", "FinalProduct"]);
            setDiscountFinalProduct(res.data.data);
            setTotalDiscountFinalProductsLength(res.data.meta?.total);
          })
          .catch((err) => {
            // loading
            setTimeout(function () {
              setLoading(false);
            }, 3000);

            setWrongMessage(true);
          });
      } catch (err) {
        console.log(err);
      }
    };
    // call functions
    getDiscountFinalProduct();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newDiscountFinalProduct,
      [e.target.name]: e.target.value,
    };
    setNewDiscountFinalProduct(newData);
  };

  // search & filter & pagination

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchRequestControls, setSearchRequestControls] = useState({
    queryString: "",
    filterType: "",
    pageNumber: "",
    perPage: "",
  });

  const onPageChange = (e) => {
    setRowsPerPage(e.rows);
    setPageNumber(e.page + 1);

    handleSearchReq(e, {
      perPage: e.rows,
      pageNumber: e.page + 1,
    });
  };

  const handleSearchReq = async (
    e,
    { queryString, filterType, perPage, pageNumber }
  ) => {
    try {
      setSearchRequestControls({
        queryString: queryString,
        filterType: filterType,
        pageNumber: pageNumber,
        perPage: perPage,
      });

      const res = await axios.get(
        `${base_url}/admin/company/accounting/discount-final-products/search/${discountID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setDiscountFinalProduct(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async ({ id, value }) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/discount-final-product/${id}`,
        config
      );
      const newRow = discountFinalProduct.filter((item) => item.id !== id);
      setDiscountFinalProduct(newRow); // setRow(filterItems);
      Toastify({
        text: `${value} deleted `,
        style: {
          background: "green",
          color: "white",
        },
      }).showToast();
    } else {
      Toastify({
        text: `${value} haven't deleted `,
        style: {
          background: "orange",
          color: "white",
        },
      }).showToast();
    }
  };

  // add
  const handleAdd = () => {
    setAddModal(true);
  };

  const handleSubmitAdd = async () => {
    const data = {
      client_id: newDiscountFinalProduct.client_id,
      company_id: newDiscountFinalProduct.company_id,
      discount_id: newDiscountFinalProduct.discount_id,
      final_products: [
        {
          category_id: newDiscountFinalProduct.category_id,
          product_id: newDiscountFinalProduct.product_id,
          final_product_id: newDiscountFinalProduct.final_product_id,
        },
      ],
    };

    console.log("data", data);
    await axios
      .post(`${base_url}/admin/company/accounting/discount-final-product`, data)
      .then((res) => {
        Toastify({
          text: `discount created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        discountFinalProduct.unshift(res.data.data);
        setNewDiscountFinalProduct({
          client_id: clientID,
          company_id: companyID,
          discount_id: discountID,
          category_id: "",
          product_id: "",
          final_product_id: "",
        });
        setAddModal(false);
      })
      .catch((err) => {
        console.log("err", err.response.data.message);
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // show
  const handleShow = async (id) => {
    setShowModal(true);
    const res = await axios.get(
      `${base_url}/admin/company/accounting/discount-final-product/${id}`,
      config
    );
    setSelectedItem(res.data.data);
    console.log(
      "show",res.data.data)
  };

  // close any modal
  const handleClose = () => {
    setShowModal(false);
    setAddModal(false);
  };
  // ////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* variants */}
      {!loading && !wrongMessage && (
        <div className="DiscountFinalProduct">
          {/* header */}
          <h1 className="header">{t("DiscountFinalProduct")}</h1>
          {/* upper table */}
          <TableFilter
            handleAdd={handleAdd}
            inputName="queryString"
            inputValue={searchRequestControls.queryString}
            handleChangeSearch={(e) =>
              handleSearchReq(e, { queryString: e.target.value })
            }
          />
          {/* table */}
          {discountFinalProduct.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalDiscountFinalProductsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {discountFinalProduct?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.final_product?.details}</td>

                  {/* icons */}
                  <td className="icons">
                    {/* delete */}
                    <Link
                      className="delete"
                      to=""
                      onClick={() => handleDelete(item?.id, item?.name)}
                    >
                      <i className="ri-delete-bin-2-fill"></i>
                    </Link>
                    {/* show */}
                    <Link
                      className="show"
                      to=""
                      onClick={() => handleShow(item?.id)}
                    >
                      <i className="ri-eye-line"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="Discount Final Product" />
          )}
          {/* modals */}
          {/* show modal */}
          <ModalShow
            show={showModal}
            handleClose={handleClose}
            item={selectedItem}
          />
          {/* add modal */}
          <ModalAdd
            show={addModal}
            companyID={companyID}
            newDiscountFinalProduct={newDiscountFinalProduct}
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmitAdd={handleSubmitAdd}
          />
        </div>
      )}
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

export default DiscountFinalProduct;
