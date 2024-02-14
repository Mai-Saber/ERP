import React, { useState, useEffect } from "react";

import NoData from "../../../../common/noData/noData";
import Table from "../../../../common/table/table";
import "../../../../common/show modal/showModal.css";
import TableFilter from "../../../../common/tableFilter/tableFilter";
import Loading from "../../../../common/loading/loading";
import TableIcons from "../../../../common/tableIcons/tableIcons";
import WrongMessage from "../../../../common/wrongMessage/wrongMessage";
import { base_url, config } from "../../../../service/service";

import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { useTranslation } from "react-i18next";

import ModalShow from "./modals/show";
import ModalAdd from "./modals/add";
import ModalEdit from "./modals/edit";

export  function PriceListProduct(props) {
  const [loading, setLoading] = useState(true);
  const [wrongMessage, setWrongMessage] = useState(false);
  const [companyID, setCompanyID] = useState(props.companyIDInApp);
  const [clientID, setClientID] = useState(props.clientIdInApp);
  const [priceListId, setPriceListID] = useState(props.priceListIdInApp);
  const [columnsHeader, setColumnsHeader] = useState([]);
  const [priceListProducts, setPriceLIstProducts] = useState([]);
  const [totalPriceListProductsLength, setTotalPriceListProductsLength] =
    useState("");
 
  //modals
  const [showModal, setShowModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [editItem, setEditItem] = useState({});
  const [newPriceListProduct, setNewPriceListProduct] = useState({
    client_id: clientID,
    company_id: companyID,
    price_list_id: priceListId,
    final_product_id: "",
    price: "",
  });
  const { t } = useTranslation();

  // general
  useEffect(() => {
    // get variants
    const getPriceListProducts = async () => {
      try {
        const url = `${base_url}/admin/company/price-list/price-list-products/${priceListId}`;
        await axios
          .get(url)
          .then((res) => {
            setLoading(false);
            console.log("res", res.data.data);
            setColumnsHeader(["Id", "price List", "Value"]);
            setPriceLIstProducts(res.data.data);
            setTotalPriceListProductsLength(res.data.meta?.total);
          })
          .catch((err) => {
            console.log("err", err)
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
    getPriceListProducts();
  }, []);

  // change any input
  const handleChange = (e) => {
    const newData = {
      ...newPriceListProduct,
      [e.target.name]: e.target.value,
    };
    setNewPriceListProduct(newData);

    const newItem = {
      ...editItem,
      [e.target.name]: e.target.value,
    };
    setEditItem(newItem);
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
        `${base_url}/admin/company/price-list/price-list-products/search/${priceListId}?
          per_page=${Number(perPage) || ""}
          &query_string=${queryString || ""}
          &user_account_type_id=${filterType || ""}
          &page=${pageNumber || ""}
    `
      );
      setPriceLIstProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // delete
  const handleDelete = async ({ id, value }) => {
    if (window.confirm("Are you Sure? ")) {
      await axios.delete(
        `${base_url}/admin/company/price-list/price-list-product/${id}`,
        config
      );
      const newRow = priceListProducts.filter((item) => item.id !== id);
      setPriceLIstProducts(newRow); // setRow(filterItems);
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

  const handleSubmitAddPriceListProduct = async () => {
    const data = {
      client_id: clientID,
      company_id: companyID,
      price_list_id: priceListId,
      final_products: [
        {
          final_product_id: newPriceListProduct.final_product_id,
          price: newPriceListProduct.price,
        },
      ],
    };

    await axios
      .post(`${base_url}/admin/company/price-list/price-list-product`, data)
      .then((res) => {
        Toastify({
          text: `product created successfully `,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        priceListProducts.unshift(res.data.data);
        setNewPriceListProduct({
          client_id: clientID,
          company_id: companyID,
          price_list_id: priceListId,
          final_product_id: "",
          price: "",
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
      `${base_url}/admin/company/price-list/price-list-product${id}`,
      config
    );
    setSelectedItem(res.data.data);
  };

  // edit
  const handleEdit = async (id) => {
    const res = await axios.get(
      `${base_url}/admin/company/price-list/price-list-product/${id}`
    );
    setEditItem(res.data.data);
    setEditModal(true);
  };

  const handleSubmitEdit = async (id) => {
    const data = {
      value: editItem.value,
    };
    await axios
      .patch(
        `${base_url}/admin/company/price-list/price-list-product/${id}`,
        data
      )
      .then((res) => {
        Toastify({
          text: `Value updated successfully`,
          style: {
            background: "green",
            color: "white",
          },
        }).showToast();
        for (let i = 0; i < priceListProducts.length; i++) {
          if (priceListProducts[i].id === id) {
            priceListProducts[i] = res.data.data;
          }
        }
        setEditItem({});
        setEditModal(false);
      })
      .catch((err) => {
        Toastify({
          text: `${err.response.data.message}`,
          style: {
            background: "red",
            color: "white",
          },
        }).showToast();
      });
  };

  // close any modal
  const handleClose = () => {
    setShowModal(false);
    setAddModal(false);
    setEditModal(false);
  };
  // ////////////////////////////////////////
  return (
    <>
      {/* loading spinner*/}
      {loading && <Loading></Loading>}

      {/* price list product */}
      {!loading && !wrongMessage && (
        <div className="PriceListProduct">
          {/* header */}
          <h1 className="header">{t("PriceListProduct")}</h1>
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
          {priceListProducts.length !== 0 ? (
            <Table
              columns={columnsHeader}
              // pagination
              first={pageNumber}
              rows={rowsPerPage}
              totalRecords={totalPriceListProductsLength}
              onPageChange={onPageChange}
            >
              {/* table children */}
              {priceListProducts?.map((item, i) => (
                <tr key={item.id}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>

                  {/* icons */}
                  <TableIcons
                    item={item}
                    handleDelete={() =>
                      handleDelete({ value: item.name, id: item.id })
                    }
                    handleEdit={handleEdit}
                    handleShow={handleShow}
                  />
                </tr>
              ))}
            </Table>
          ) : (
            <NoData data="price list product" />
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
            newPriceListProduct={newPriceListProduct}
            handleClose={handleClose}
            handleChange={handleChange}
            handleSubmitAddPriceListProduct={handleSubmitAddPriceListProduct}
          />
          {/* edit modal */}
          <ModalEdit
            show={editModal}
            handleClose={handleClose}
            editItem={editItem}
            handleChange={handleChange}
            handleSubmitEdit={handleSubmitEdit}
          />
        </div>
      )}
      {/* wrong message */}
      {!loading && wrongMessage && <WrongMessage />}
    </>
  );
}

// export default PriceListProduct;
