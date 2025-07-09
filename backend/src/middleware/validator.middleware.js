const bodyValidator = (schema) => {
    return async (req, res, next) => {
        try {
            const data = req.body;

            if (!data) {
                throw {
                    code: 400,
                    message: "Request body is required",
                    name: "BAD_REQUEST"
                };
            }

            await schema.validateAsync(data, {
                abortEarly: false,
                allowUnknown: true,
            });

            next(); // Continue
        } 
        // catch (err) {
        //     const errorBag = {
        //         code: err.code || 400,
        //         message: "Validation failed",
        //         name: err.name || "VALIDATION_ERROR",
        //         detail: {},
        //     };

        //     if (err.isJoi && Array.isArray(err.details)) {
        //         err.details.forEach(detail => {
        //             const key = detail.path.join('.');
        //             errorBag.detail[key] = detail.message;
        //         });
        //     } else {
        //         errorBag.message = err.message || "Something went wrong";
        //     }

        //     next(errorBag);
        // }
        catch (error) {
      // Build a detailed error object to send back
      const details = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: details,
      });
    }
    };

};

module.exports = bodyValidator;
