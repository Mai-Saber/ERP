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

function TransportFinalProducts(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [transportID, setRefundID] = useState(props.refundIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [transportFinalProducts, setTransportFinalProducts] = useState([]);
  const [totalLength, setTotalLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [newTransportFinalProducts, setNewTransportFinalProducts] = useState({
    client_id: clientID,
    company_id: companyID,
    transport_request_id: transportID,

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
    const getTransportFinalProducts = async () => {
      try {
        const url = `${base_url}/admin/company/accounting/stock-management/transport-request-final-products/${transportID}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            console.log("res", res.data.data);
            setColumnsHeader(["Id", "transport Name", "final"]);
            setTransportFinalProducts(res.data.data);
            setTotalLength(res.data.meta?.total);
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
    getTransportFinalProducts();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newTransportFinalProducts,
      [e.target.name]: e.target.value,
    };
    setNewTransportFinalProducts(newData);
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
        `${base_url}/admin/company/accounting/stock-management/transport-request-final-products/search/${transportID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setTransportFinalProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async ({ id, value }) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/stock-management/transport-request-final-product/${id}`,
        config
      );
      const newRow = transportFinalProducts.filter((item) => item.id !== id);
      setTransportFinalProducts(newRow); // setRow(filterItems);
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
      client_id: newTransportFinalProducts.clientID,
      company_id: newTransportFinalProducts.companyID,
     transport_request_id:newTransportFinalProducts.transport_request_id,
      final_products: [
        {
          category_id: newTransportFinalProducts.category_id,
          product_id: newTransportFinalProducts.product_id,
          final_product_id: newTransportFinalProducts.final_product_id,
          measurement_unit_id: newTransportFinalProducts.measurement_unit_id,
          unit_price: newTransportFinalProducts.unit_price,
          count: newTransportFinalProducts.count,
        },
      ],
    };


    await axios
      .post(`${base_url}/admin/company/accounting/stock-management/transport-request-final-product`, data)
      .then((res) => {
        Toastify({
          text: `transport created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        transportFinalProducts.unshift(res.data.data);
        setNewTransportFinalProducts({
          client_id: clientID,
          company_id: companyID,
          transport_request_id: transportID,

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
      `${base_url}/admin/company/accounting/stock-management/transport-request-final-product/${id}`,
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
        <div className="transportFinalProducts">
          {/* header */}
          <h1 className="header">{t("TransportFinalProducts")}</h1>
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
          {transportFinalProducts.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {transportFinalProducts?.map((item, i) => (
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
            <NoData data="transport Final products" />
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
            newTransportFinalProducts={newTransportFinalProducts}
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

export default TransportFinalProducts;
