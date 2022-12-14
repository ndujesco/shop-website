const deleteProduct = async (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");
  try {
    productElement.parentNode.removeChild(productElement);
    console.log(prodId, 1);
    await fetch("/admin/product/" + prodId, {
      method: "DELETE",
      headers: {
        "csrf-token": csrf,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
