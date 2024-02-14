import React, { useState, useEffect } from "react";

import Table from "../../../../common/table/table";
import TableFilter from "../../../../common/tableFilter/tableFilter";
import "../../../../common/show modal/showModal.css";
import Loading from "../../../../common/loading/loading";
import TableIcons from "../../../../common/tableIcons/tableIcons";
import NoData from "../../../../common/noData/noData";
import WrongMessage from "../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import { Link } from "react-router-dom";

function Discount(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [totalDiscountsLength, setTotalDiscountsLength] = useState("");

  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [newDiscount, setNewDiscount] = useState({
    client_id: clientID,
    company_id: companyID,
    name: "",
    details: "",
    date_from: "",
    date_to: "",
    dicount_percentage: "",
    category_id: "",
    product_id: "",
    final_product_id: "",
    branch_ids: [],
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    console.log("discount page", companyID);
    // get contacts
    const getDiscount = async () => {
      const url = `${base_url}/admin/company/accounting/discounts/${companyID}`;
      await axios
        .get(url)
        .then((res) => {
          setLoading(false);
          setColumnsHeader(["Id", "Company Name", "Name", "Details"]);
          setDiscount(res.data.data);
          console.log("res", res.data.data);
          setTotalDiscountsLength(res.data.meta?.total);
        })
        .catch((err) => {
          console.log("err", err);
          // loading
          setTimeout(function () {
            setLoading(false);
          }, 3000);

          setWrongMessage(true);
        });
    };
    // call functions
    getDiscount();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newDiscount,
      [e.target.name]: e.target.value,
    };
    setNewDiscount(newData);
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
        `${base_url}/admin/company/accounting/discounts/search/${companyID}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setDiscount(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async (id, name) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/accounting/discount/${id}`,
        config
      );
      const newRow = discount.filter((item) => item.id !== id);
      setDiscount(newRow); // setRow(filterItems);
      Toastify({
        text: `${name} deleted `,
        style: {
          background: "green",
          color: "white",
        },
      }).showToast();
    } else {
      Toastify({
        text: `${name} haven't deleted `,
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
      client_id: clientID,
      company_id: companyID,
      name: newDiscount.name,
      details: newDiscount.details,
      date_from: newDiscount.date_from,
      date_to: newDiscount.date_to,
      dicount_percentage: newDiscount.dicount_percentage,
      final_products: [
        {
          category_id: newDiscount.category_id,
          product_id: newDiscount.product_id,
          final_product_id: newDiscount.final_product_id,
        },
      ],
      branch_ids: [newDiscount.branch_ids],
    };
    console.log("data", data);
    await axios
      .post(`${base_url}/admin/company/accounting/discount`, data)
      .then((res) => {
        Toastify({
          text: `Discount created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        discount.unshift(res.data.data);
        setNewDiscount({
          client_id: clientID,
          company_id: companyID,
          name: "",
          details: "",
          date_from: "",
          date_to: "",
          dicount_percentage: "",
          category_id: "",
          product_id: "",
          final_product_id: "",
          branch_ids: [],
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
      `${base_url}/admin/company/accounting/discount/${id}`,
      config
    );
    setSelectedItem(res.data.data);
        console.log("show", res.data.data);

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

      {/* branches */}
      {!loading && !wrongMessage && (
        <div className="discount">
          {/* header */}
          <h1 className="header">{t("Discount")}</h1>
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
          {discount.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalDiscountsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {discount?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>

                  <td className="name">{item.company?.name}</td>
                  <td>{item.name}</td>
                  <td>{item.details}</td>
                  {/* Discount Final Product */}
                  <td>
                    <Link
                      to="/companies/discount/discountFinalProduct"
                      className="btn btn-primary"
                      onClick={() =>
                        props.handleDiscountFinalProduct(
                          item?.id,
                          item?.company?.client_id,
                          item?.company?.id
                        )
                      }
                    >
                      {t("DiscountFinalProduct")}
                    </Link>
                  </td>
                  {/* Discount Branch */}
                  <td>
                    <Link
                      to="/companies/discount/discountBranch"
                      className="btn btn-primary"
                      onClick={() =>
                        props.handleDiscountBranch(
                          item?.id,
                          item?.company?.client_id,
                          item?.company?.id
                        )
                      }
                    >
                      {t("DiscountBranch")}
                    </Link>
                  </td>
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
            <NoData data="Discounts" />
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
            handleClose={handleClose}
            companyID={companyID}
            newDiscount={newDiscount}
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

export default Discount;
