import { BaseRepository } from "./base_repository";
import { SalesData, Platform, SalesSummary, TimeSeriesData, PlatformAnalysis, CustomerAnalysis, ProductAnalysis, PrefectureAnalysis, CategoryAnalysis, SalesDataSchema } from "@/models/sales_data";

export class SalesDataRepository extends BaseRepository<typeof SalesDataSchema> {
  private readonly salesTableId = "tblthgeljeKsEteau";
  private readonly platformTableId = "tblRzKxxlatgPFJoE";
  protected searchFields: string[] = ['name', 'userId', 'productName', 'prefecture'];

  // プラットフォームIDと名前のマッピング
  private readonly platformMapping: Record<string, string> = {
    'rec5y6uYA61ufVnPY': 'ふるさとチョイス',
    'recE2xXek8GyjVaQk': 'さとふる',
    'recdIdd4rOYpkcaSB': '楽天ふるさと納税',
  };

  // 年代IDと名前のマッピング（現在は文字列だが、将来的なID参照に対応）
  private readonly ageGroupMapping: Record<string, string> = {
    '20代': '20代',
    '30代': '30代',
    '40代': '40代',
    '50代': '50代',
    '60代': '60代',
    '70代以上': '70代以上',
  };

  // 性別IDと名前のマッピング（現在は文字列だが、将来的なID参照に対応）
  private readonly genderMapping: Record<string, string> = {
    '男性': '男性',
    '女性': '女性',
  };

  // プラットフォーム名からIDを取得
  private getPlatformIdByName(name: string): string | undefined {
    return Object.entries(this.platformMapping).find(([, platformName]) => platformName === name)?.[0];
  }

  // プラットフォームIDから名前を取得
  private getPlatformNameById(id: string): string {
    return this.platformMapping[id] || id;
  }

  // 年代名からIDを取得（現在は名前と同じ）
  private getAgeGroupIdByName(name: string): string {
    return this.ageGroupMapping[name] || name;
  }

  // 年代IDから名前を取得（現在はIDと同じ）
  private getAgeGroupNameById(id: string): string {
    return this.ageGroupMapping[id] || id;
  }

  // 性別名からIDを取得（現在は名前と同じ）
  private getGenderIdByName(name: string): string {
    return this.genderMapping[name] || name;
  }

  // 性別IDから名前を取得（現在はIDと同じ）
  private getGenderNameById(id: string): string {
    return this.genderMapping[id] || id;
  }

  constructor() {
    super(SalesDataSchema);
  }

  async get(
    offset: number = 0,
    limit: number = 20,
    _order?: string,
    _direction?: string,
    _query?: string
  ): Promise<{ data: SalesData[]; count: number }> {
    const allData = await this.getAllSalesData();
    const filteredData = allData.slice(offset, offset + limit);
    return { data: filteredData, count: allData.length };
  }

  async findById(id: string): Promise<SalesData> {
    const allData = await this.getAllSalesData();
    const found = allData.find(item => item.id === id);
    if (!found) { throw new Error(`SalesData with id ${id} not found`); }
    return found;
  }

  async create(_item: Omit<SalesData, "id">): Promise<SalesData> {
    throw new Error("Create operation not implemented for SalesDataRepository");
  }

  async update(_id: string, _item: Partial<SalesData>): Promise<SalesData> {
    throw new Error("Update operation not implemented for SalesDataRepository");
  }

  async delete(_id: string): Promise<void> {
    throw new Error("Delete operation not implemented for SalesDataRepository");
  }

  async getAllSalesData(): Promise<SalesData[]> {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = "appNdJ75OD4xUiHEq";
    const tableId = this.salesTableId;
    
    if (!apiKey) {
      console.error('AIRTABLE_API_KEY is not set');
      return [];
    }

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${baseId}/${tableId}?maxRecords=1000`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.records.map((record: { id: string; fields: Record<string, unknown> }) => ({
        id: record.id,
        name: (record.fields.Name as string) || "",
        userId: (record.fields.ユーザーID as string) || "",
        productName: (record.fields.商品名 as string) || "",
        category: (record.fields.カテゴリ as string) || "",
        amount: (record.fields.寄付金額 as number) || 0,
        orderDate: (record.fields.注文日時 as string) || "",
        prefecture: (record.fields.都道府県 as string) || "",
        ageGroup: (record.fields.年代 as string) || "",
        gender: (record.fields.性別 as string) || "",
        paymentMethod: (record.fields.支払い方法 as string) || "",
        status: (record.fields.ステータス as string) || "",
        platformCategory: Array.isArray(record.fields.プラットフォームカテゴリ) 
          ? record.fields.プラットフォームカテゴリ as string[]
          : [],
      }));
    } catch (error) {
      console.error('Error fetching sales data from Airtable:', error);
      return [];
    }
  }

  async getPlatforms(): Promise<Platform[]> {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = "appNdJ75OD4xUiHEq";
    const tableId = this.platformTableId;
    
    if (!apiKey) {
      console.error('AIRTABLE_API_KEY is not set');
      return [];
    }

    try {
      const response = await fetch(
        `https://api.airtable.com/v0/${baseId}/${tableId}?maxRecords=100`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return data.records.map((record: { id: string; fields: Record<string, unknown> }) => ({
        id: record.id,
        name: (record.fields.Name as string) || "",
        linkedRecords: Array.isArray(record.fields.縦連結) 
          ? record.fields.縦連結 as string[]
          : [],
      }));
    } catch (error) {
      console.error('Error fetching platforms from Airtable:', error);
      return [];
    }
  }

  async getSalesSummary(startDate?: string, endDate?: string, platforms?: string[], ageGroups?: string[], genders?: string[]): Promise<SalesSummary> {
    const salesData = await this.getAllSalesData();
    
    // フィルタリング
    let filteredData = salesData;
    
    if (startDate || endDate) {
      filteredData = filteredData.filter(data => {
        const orderDate = new Date(data.orderDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
        return true;
      });
    }
    
    // プラットフォームフィルター
    if (platforms && platforms.length > 0) {
      const targetPlatformIds = platforms
        .map(name => this.getPlatformIdByName(name))
        .filter((id): id is string => id !== undefined);
      
      filteredData = filteredData.filter(data => 
        data.platformCategory.some(platformId => targetPlatformIds.includes(platformId))
      );
    }
    
    // 年代フィルター
    if (ageGroups && ageGroups.length > 0) {
      const targetAgeGroupIds = ageGroups.map(name => this.getAgeGroupIdByName(name));
      filteredData = filteredData.filter(data => targetAgeGroupIds.includes(data.ageGroup));
    }
    
    // 性別フィルター
    if (genders && genders.length > 0) {
      const targetGenderIds = genders.map(name => this.getGenderIdByName(name));
      filteredData = filteredData.filter(data => targetGenderIds.includes(data.gender));
    }
    
    const totalSales = filteredData.reduce((sum, data) => sum + data.amount, 0);
    const totalTransactions = filteredData.length;
    const uniqueCustomers = new Set(filteredData.map(data => data.userId)).size;
    const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;

    return {
      totalSales,
      totalTransactions,
      uniqueCustomers,
      averageOrderValue,
    };
  }

  async getTimeSeriesData(startDate?: string, endDate?: string): Promise<TimeSeriesData[]> {
    const salesData = await this.getAllSalesData();
    
    // フィルタリング
    let filteredData = salesData;
    
    if (startDate || endDate) {
      filteredData = salesData.filter(data => {
        const orderDate = new Date(data.orderDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
        return true;
      });
    }
    
    // 日付でグループ化
    const groupedByDate = filteredData.reduce((acc, data) => {
      const date = data.orderDate;
      if (!acc[date]) {
        acc[date] = { sales: 0, transactions: 0 };
      }
      acc[date].sales += data.amount;
      acc[date].transactions += 1;
      return acc;
    }, {} as Record<string, { sales: number; transactions: number }>);

    return Object.entries(groupedByDate)
      .map(([date, data]) => ({
        date,
        sales: data.sales,
        transactions: data.transactions,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getPlatformAnalysis(startDate?: string, endDate?: string, platforms?: string[], ageGroups?: string[], genders?: string[]): Promise<PlatformAnalysis[]> {
    const salesData = await this.getAllSalesData();
    
    // フィルタリング
    let filteredData = salesData;
    
    if (startDate || endDate) {
      filteredData = filteredData.filter(data => {
        const orderDate = new Date(data.orderDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
        return true;
      });
    }
    
    // プラットフォームフィルター
    if (platforms && platforms.length > 0) {
      const targetPlatformIds = platforms
        .map(name => this.getPlatformIdByName(name))
        .filter((id): id is string => id !== undefined);
      
      filteredData = filteredData.filter(data => 
        data.platformCategory.some(platformId => targetPlatformIds.includes(platformId))
      );
    }
    
    // 年代フィルター
    if (ageGroups && ageGroups.length > 0) {
      const targetAgeGroupIds = ageGroups.map(name => this.getAgeGroupIdByName(name));
      filteredData = filteredData.filter(data => targetAgeGroupIds.includes(data.ageGroup));
    }
    
    // 性別フィルター
    if (genders && genders.length > 0) {
      const targetGenderIds = genders.map(name => this.getGenderIdByName(name));
      filteredData = filteredData.filter(data => targetGenderIds.includes(data.gender));
    }
    
    // プラットフォームカテゴリからユニークなプラットフォームIDを取得
    const platformIdSet = new Set<string>();
    filteredData.forEach(data => {
      data.platformCategory.forEach(platformId => {
        platformIdSet.add(platformId);
      });
    });
    
    // プラットフォームフィルターが指定されている場合は、そのプラットフォームのみを対象とする
    const finalTargetPlatformIds = platforms && platforms.length > 0 
      ? platforms
          .map(name => this.getPlatformIdByName(name))
          .filter((id): id is string => id !== undefined && platformIdSet.has(id))
      : Array.from(platformIdSet);
    
    return finalTargetPlatformIds.map(platformId => {
      const platformData = filteredData.filter(data => 
        data.platformCategory.includes(platformId)
      );
      
      const sales = platformData.reduce((sum, data) => sum + data.amount, 0);
      const transactions = platformData.length;
      const averageOrderValue = transactions > 0 ? sales / transactions : 0;
      const uniqueCustomers = new Set(platformData.map(data => data.userId)).size;

      return {
        platform: this.getPlatformNameById(platformId), // IDを名前に変換
        sales,
        transactions,
        averageOrderValue,
        uniqueCustomers,
      };
    }).sort((a, b) => b.sales - a.sales); // 売上順でソート
  }

  async getCustomerAnalysis(startDate?: string, endDate?: string, platforms?: string[], ageGroups?: string[], genders?: string[]): Promise<CustomerAnalysis[]> {
    const salesData = await this.getAllSalesData();
    
    // フィルタリング
    let filteredData = salesData;
    
    if (startDate || endDate) {
      filteredData = filteredData.filter(data => {
        const orderDate = new Date(data.orderDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
        return true;
      });
    }
    
    // プラットフォームフィルター
    if (platforms && platforms.length > 0) {
      const targetPlatformIds = platforms
        .map(name => this.getPlatformIdByName(name))
        .filter((id): id is string => id !== undefined);
      
      filteredData = filteredData.filter(data => 
        data.platformCategory.some(platformId => targetPlatformIds.includes(platformId))
      );
    }
    
    // 年代フィルター
    if (ageGroups && ageGroups.length > 0) {
      const targetAgeGroupIds = ageGroups.map(name => this.getAgeGroupIdByName(name));
      filteredData = filteredData.filter(data => targetAgeGroupIds.includes(data.ageGroup));
    }
    
    // 性別フィルター
    if (genders && genders.length > 0) {
      const targetGenderIds = genders.map(name => this.getGenderIdByName(name));
      filteredData = filteredData.filter(data => targetGenderIds.includes(data.gender));
    }
    
    const genderGroups = ['男性', '女性'];
    
    return genderGroups.map(gender => {
      const genderData = filteredData.filter(data => data.gender === gender);
      const sales = genderData.reduce((sum, data) => sum + data.amount, 0);
      const transactions = genderData.length;
      const averageOrderValue = transactions > 0 ? sales / transactions : 0;

      return {
        ageGroup: '全体', // 性別別分析では年代は全体として扱う
        gender,
        sales,
        transactions,
        averageOrderValue,
      };
    }).sort((a, b) => b.sales - a.sales);
  }

  async getProductAnalysis(startDate?: string, endDate?: string, platforms?: string[], ageGroups?: string[], genders?: string[]): Promise<ProductAnalysis[]> {
    const salesData = await this.getAllSalesData();
    
    // フィルタリング
    let filteredData = salesData;
    
    if (startDate || endDate) {
      filteredData = filteredData.filter(data => {
        const orderDate = new Date(data.orderDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
        return true;
      });
    }
    
    // プラットフォームフィルター
    if (platforms && platforms.length > 0) {
      const targetPlatformIds = platforms
        .map(name => this.getPlatformIdByName(name))
        .filter((id): id is string => id !== undefined);
      
      filteredData = filteredData.filter(data => 
        data.platformCategory.some(platformId => targetPlatformIds.includes(platformId))
      );
    }
    
    // 年代フィルター
    if (ageGroups && ageGroups.length > 0) {
      const targetAgeGroupIds = ageGroups.map(name => this.getAgeGroupIdByName(name));
      filteredData = filteredData.filter(data => targetAgeGroupIds.includes(data.ageGroup));
    }
    
    // 性別フィルター
    if (genders && genders.length > 0) {
      const targetGenderIds = genders.map(name => this.getGenderIdByName(name));
      filteredData = filteredData.filter(data => targetGenderIds.includes(data.gender));
    }
    
    const grouped = filteredData.reduce((acc, data) => {
      if (!acc[data.productName]) {
        acc[data.productName] = {
          productName: data.productName,
          category: data.category,
          sales: 0,
          transactions: 0,
          averageOrderValue: 0,
        };
      }
      acc[data.productName].sales += data.amount;
      acc[data.productName].transactions += 1;
      return acc;
    }, {} as Record<string, ProductAnalysis>);

    return Object.values(grouped)
      .map(data => ({
        ...data,
        averageOrderValue: data.transactions > 0 ? data.sales / data.transactions : 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10); // 上位10商品
  }

  async getPrefectureAnalysis(startDate?: string, endDate?: string, platforms?: string[], ageGroups?: string[], genders?: string[]): Promise<PrefectureAnalysis[]> {
    const salesData = await this.getAllSalesData();
    
    // フィルタリング
    let filteredData = salesData;
    
    if (startDate || endDate) {
      filteredData = filteredData.filter(data => {
        const orderDate = new Date(data.orderDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
        return true;
      });
    }
    
    // プラットフォームフィルター
    if (platforms && platforms.length > 0) {
      const targetPlatformIds = platforms
        .map(name => this.getPlatformIdByName(name))
        .filter((id): id is string => id !== undefined);
      
      filteredData = filteredData.filter(data => 
        data.platformCategory.some(platformId => targetPlatformIds.includes(platformId))
      );
    }
    
    // 年代フィルター
    if (ageGroups && ageGroups.length > 0) {
      const targetAgeGroupIds = ageGroups.map(name => this.getAgeGroupIdByName(name));
      filteredData = filteredData.filter(data => targetAgeGroupIds.includes(data.ageGroup));
    }
    
    // 性別フィルター
    if (genders && genders.length > 0) {
      const targetGenderIds = genders.map(name => this.getGenderIdByName(name));
      filteredData = filteredData.filter(data => targetGenderIds.includes(data.gender));
    }
    
    const grouped = filteredData.reduce((acc, data) => {
      if (!acc[data.prefecture]) {
        acc[data.prefecture] = {
          prefecture: data.prefecture,
          sales: 0,
          transactions: 0,
          averageOrderValue: 0,
        };
      }
      acc[data.prefecture].sales += data.amount;
      acc[data.prefecture].transactions += 1;
      return acc;
    }, {} as Record<string, PrefectureAnalysis>);

    return Object.values(grouped)
      .map(data => ({
        ...data,
        averageOrderValue: data.transactions > 0 ? data.sales / data.transactions : 0,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10); // 上位10都道府県
  }

  async getCategoryAnalysis(startDate?: string, endDate?: string, platforms?: string[], ageGroups?: string[], genders?: string[]): Promise<CategoryAnalysis[]> {
    const salesData = await this.getAllSalesData();
    
    // フィルタリング
    let filteredData = salesData;
    
    if (startDate || endDate) {
      filteredData = filteredData.filter(data => {
        const orderDate = new Date(data.orderDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && orderDate < start) return false;
        if (end && orderDate > end) return false;
        return true;
      });
    }
    
    // プラットフォームフィルター
    if (platforms && platforms.length > 0) {
      const targetPlatformIds = platforms
        .map(name => this.getPlatformIdByName(name))
        .filter((id): id is string => id !== undefined);
      
      filteredData = filteredData.filter(data => 
        data.platformCategory.some(platformId => targetPlatformIds.includes(platformId))
      );
    }
    
    // 年代フィルター
    if (ageGroups && ageGroups.length > 0) {
      const targetAgeGroupIds = ageGroups.map(name => this.getAgeGroupIdByName(name));
      filteredData = filteredData.filter(data => targetAgeGroupIds.includes(data.ageGroup));
    }
    
    // 性別フィルター
    if (genders && genders.length > 0) {
      const targetGenderIds = genders.map(name => this.getGenderIdByName(name));
      filteredData = filteredData.filter(data => targetGenderIds.includes(data.gender));
    }
    
    const totalSales = filteredData.reduce((sum, data) => sum + data.amount, 0);

    const grouped = filteredData.reduce((acc, data) => {
      if (!acc[data.category]) {
        acc[data.category] = {
          category: data.category,
          sales: 0,
          transactions: 0,
          averageOrderValue: 0,
          percentage: 0
        };
      }
      acc[data.category].sales += data.amount;
      acc[data.category].transactions += 1;
      return acc;
    }, {} as Record<string, CategoryAnalysis>);

    return Object.values(grouped)
      .map(data => ({
        ...data,
        averageOrderValue: data.transactions > 0 ? data.sales / data.transactions : 0,
        percentage: totalSales > 0 ? (data.sales / totalSales) * 100 : 0,
      }))
      .sort((a, b) => b.sales - a.sales);
  }

  async getLTVAnalysis(): Promise<{ repeatRate: number; customerLTV: Array<{ userId: string; totalSpent: number; orderCount: number }> }> {
    const salesData = await this.getAllSalesData();
    
    // 顧客別の購入履歴を集計
    const customerHistory = salesData.reduce((acc, data) => {
      if (!acc[data.userId]) {
        acc[data.userId] = { totalSpent: 0, orderCount: 0 };
      }
      acc[data.userId].totalSpent += data.amount;
      acc[data.userId].orderCount += 1;
      return acc;
    }, {} as Record<string, { totalSpent: number; orderCount: number }>);

    const customerLTV = Object.entries(customerHistory).map(([userId, data]) => ({
      userId,
      totalSpent: data.totalSpent,
      orderCount: data.orderCount,
    }));

    const totalCustomers = customerLTV.length;
    const repeatCustomers = customerLTV.filter(customer => customer.orderCount > 1).length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    return {
      repeatRate,
      customerLTV: customerLTV.sort((a, b) => b.totalSpent - a.totalSpent),
    };
  }
} 