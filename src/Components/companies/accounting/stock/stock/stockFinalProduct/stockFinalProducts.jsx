import React, { useState, useEffect } from "react";

import NoData from "../../../../../../common/noData/noData";
import Table from "../../../../../../common/table/table";
import "../../../../../../common/show modal/showModal.css";
import TableFilter from "../../../../../../common/tableFilter/tableFilter";
import Loading from "../../../../../../common/loading/loading";
import WrongMessage from "../../../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import { Link } from "react-router-dom";

function StockFinalProducts(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [stockID, setStockID] = useState(props.stockIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [stockFinalProducts, setStockFinalProducts] = useState([]);
  const [totalStocksLength, setTotalStocksLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [newStockFinalProducts, setNewStockFinalProducts] = useState({
    client_id: clientID,
    company_id: companyID,
    stocking_request_id: stockID,

    category_id: "",
    product_id: "",
    final_product_id: "",
    measurement_unit_id: "",
    unit_price: "",
    count: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // getRefundFinalProducts
    const getStockFinalProducts = async () => {
      try {
        const url = `${base_url}/admin/company/accounting/stock-management/stocking-request-final-product/${stockID}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            console.log("res", res.data.data);
            setColumnsHeader(["Id", "stock Name", " name"]);
            setStockFinalProducts(res.data.data);
            setTotalStocksLength(res.data.meta?.total);
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
    getStockFinalProducts();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newStockFinalProducts,
      [e.target.name]: e.target.value,
    };
    setNewStockFinalProducts(newData);
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
        `${base_url}/admin/company/accounting/stock-management/stocking-request-final-products/search/${stockID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setStockFinalProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async ({ id, value }) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/stock-management/stocking-request-final-product/${id}`,
        config
      );
      const newRow = stockFinalProducts.filter((item) => item.id !== id);
      setStockFinalProducts(newRow); // setRow(filterItems);
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
      client_id: newStockFinalProducts.clientID,
      company_id: newStockFinalProducts.companyID,
      stocking_request_id: newStockFinalProducts.stocking_request_id,
      final_products: [
        {
          category_id: newStockFinalProducts.category_id,
          product_id: newStockFinalProducts.product_id,
          final_product_id: newStockFinalProducts.final_product_id,
          measurement_unit_id: newStockFinalProducts.measurement_unit_id,
          unit_price: newStockFinalProducts.unit_price,
          count: newStockFinalProducts.count,
        },
      ],
    };

    await axios
      .post(
        `${base_url}/admin/company/accounting/stock-management/stocking-request-final-product`,
        data
      )
      .then((res) => {
        Toastify({
          text: `stock created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        stockFinalProducts.unshift(res.data.data);
        setNewStockFinalProducts({
          client_id: clientID,
          company_id: companyID,
          stocking_request_id: stockID,

          category_id: "",
          product_id: "",
          final_product_id: "",
          measurement_unit_id: "",
          unit_price: "",
          count: "",
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
      `${base_url}/admin/company/accounting/stock-management/stocking-request-final-product/${id}`,
      config
    );
    setSelectedItem(res.data.data);
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
        <div className="stockFinalProducts">
          {/* header */}
          <h1 className="header">{t("stockFinalProducts")}</h1>
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
          {stockFinalProducts.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalStocksLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {stockFinalProducts?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.value}</td>

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
            <NoData data="stock Final products" />
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
            newStockFinalProducts={newStockFinalProducts}
            companyID={companyID}
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

export default StockFinalProducts;
