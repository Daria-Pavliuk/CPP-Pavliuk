export function validateCosmetic(req, res, next) {
    const { name, brand, description, price } = req.body;

    const textFieldsAreValid = [name, brand, description].every(
        (value) => typeof value === "string" && value.trim().length > 0
    );

    const numericPrice = Number(price);
    const priceIsValid = Number.isFinite(numericPrice) && numericPrice > 0;

    if (!textFieldsAreValid || !priceIsValid) {
        return res.status(400).json({
            message:
                "Поля name, brand і description мають бути непорожніми рядками, а price — додатним числом",
        });
    }

    req.body.name = name.trim();
    req.body.brand = brand.trim();
    req.body.description = description.trim();
    req.body.price = numericPrice;

    next();
}
