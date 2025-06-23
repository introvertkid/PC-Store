import { Client } from "@elastic/elasticsearch";
import db from "../database/dbConnection.js";

const esClient = new Client({ node: 'http://localhost:9200' });

export const elasticSearch = async (req, res) => {
    const { query } = req.query;

    try {
        const result = await esClient.search({
            index: "products",
            body: {
                query: {
                    multi_match: {
                        query: query,
                        fields: ["name^2", "description"],
                        fuzziness: "AUTO" // Thêm fuzziness để tìm kiếm gần đúng
                    }
                }
            }
        });

        console.log(`Search query: ${query}, Results: ${result.hits.hits.length}`);
        res.status(200).json(result.hits.hits.map(hit => hit._source));
    } catch (err) {
        console.error("Search error:", err.message);
        res.status(500).send(err.message);
    }
};

(async () => {
    try {
        await esClient.indices.delete({ index: "products", ignore_unavailable: true });

        await esClient.indices.create({
            index: "products",
            body: {
                mappings: {
                    properties: {
                        name: { type: "text" },
                        description: { type: "text" },
                        price: { type: "float" }
                    }
                }
            }
        });

        const query = "SELECT productID as id, productName as name, productDescription as description, price FROM products";
        const result = await db.query(query);

        console.log(`There are ${result.rowCount} products in result`);
        console.log("Raw query results: ", result.rows);

        if (result.rowCount === 0) {
            console.log("No products found.");
            return;
        }

        const bulkOps = result.rows.flatMap((doc) => [
            { index: { _index: "products", _id: String(doc.id) } },
            {
                name: doc.name,
                description: doc.description,
                price: doc.price
            }
        ]);

        console.log("Bulk operations:", bulkOps);
        await esClient.bulk({ refresh: true, body: bulkOps });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Đợi 1 giây
        console.log("Data synced to Elasticsearch successfully.");
    } catch (err) {
        console.error("Sync failed:", err);
    }
})();