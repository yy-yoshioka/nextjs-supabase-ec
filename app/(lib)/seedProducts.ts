import { createProduct } from "./supabaseDb";

// サンプル商品データ
const sampleProducts = [
  {
    name: "高級レザーバッグ",
    price: 24800,
    description:
      "高品質な本革を使用した耐久性のあるレザーバッグです。ビジネスシーンからカジュアルなお出かけまで幅広く使えます。内部には小物を整理できるポケットが充実しています。\n\n・素材：本革（牛革）\n・サイズ：W40 × H30 × D12cm\n・重量：約950g\n・カラー：ブラック、ブラウン、キャメル",
    image_url:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "ワイヤレスノイズキャンセリングヘッドホン",
    price: 32500,
    description:
      "高音質と快適な装着感を両立したワイヤレスヘッドホン。最新のノイズキャンセリング技術で周囲の騒音を効果的に低減し、クリアな音楽体験を提供します。\n\n・連続再生時間：最大30時間\n・充電時間：約2.5時間\n・Bluetooth接続：バージョン5.0\n・重量：約250g",
    image_url:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "スマートウォッチ Pro",
    price: 42800,
    description:
      "健康管理と日常生活をサポートする多機能スマートウォッチ。心拍数、睡眠トラッキング、歩数計、各種運動モードを搭載。スマートフォンの通知も確認できます。\n\n・ディスプレイ：1.4インチ有機EL\n・バッテリー：最大7日間\n・防水：5ATM\n・対応OS：iOS 12.0以上、Android 8.0以上",
    image_url:
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "オーガニックコットンTシャツ",
    price: 4980,
    description:
      "環境に配慮したオーガニックコットン100%使用のTシャツ。肌触りが良く、吸湿性に優れています。シンプルなデザインで様々なコーディネートに合わせやすい一枚です。\n\n・素材：オーガニックコットン100%\n・サイズ：S、M、L、XL\n・カラー：ホワイト、ブラック、ネイビー、グレー\n・生産国：日本",
    image_url:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "ステンレスボトル",
    price: 3280,
    description:
      "真空断熱構造で温かい飲み物は最大12時間、冷たい飲み物は最大24時間保温・保冷します。軽量でありながら耐久性に優れ、アウトドアやオフィスでの使用に最適です。\n\n・容量：500ml\n・素材：18/8ステンレス\n・重量：約300g\n・カラー：シルバー、マットブラック、ホワイト",
    image_url:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "ハイブリッドバックパック",
    price: 15800,
    description:
      "ビジネスとカジュアルの両方に対応するバックパック。15.6インチまでのノートPCを収納できるパッド入りコンパートメントを備え、防水素材で大切な荷物を守ります。\n\n・素材：防水ポリエステル、YKKジッパー\n・容量：約25L\n・サイズ：W30 × H45 × D15cm\n・特徴：USB充電ポート付き",
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "アロマディフューザー",
    price: 6980,
    description:
      "超音波加湿式のアロマディフューザー。静かな動作音と7色のLEDライトで、リラックスできる空間を演出します。自動オフ機能付きで安心して使用できます。\n\n・タンク容量：300ml\n・連続使用時間：最大8時間\n・適用面積：約20㎡\n・電源：USB/AC",
    image_url:
      "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=1000&auto=format&fit=crop",
  },
  {
    name: "木製キッチンツールセット",
    price: 5480,
    description:
      "天然の木材を使用した環境に優しいキッチンツールセット。耐熱性があり、鍋やフライパンを傷つけません。シンプルで美しいデザインはキッチンを華やかに演出します。\n\n・セット内容：菜箸、ターナー、スプーン、フォーク、スパチュラ\n・素材：天然ブナ材\n・お手入れ：手洗い推奨\n・生産国：ドイツ",
    image_url:
      "https://images.unsplash.com/photo-1590794056599-7a0271e7831c?q=80&w=1000&auto=format&fit=crop",
  },
];

/**
 * サンプル商品データをSupabaseに登録する関数
 */
export async function seedProducts() {
  console.log("サンプル商品データの登録を開始します...");

  try {
    const createdProducts = await Promise.all(
      sampleProducts.map(async (product) => {
        const createdProduct = await createProduct(product);
        console.log(
          `商品「${createdProduct.name}」を登録しました (ID: ${createdProduct.id})`
        );
        return createdProduct;
      })
    );

    console.log(`${createdProducts.length}件の商品を正常に登録しました！`);
    return createdProducts;
  } catch (error) {
    console.error("商品登録中にエラーが発生しました:", error);
    throw error;
  }
}
