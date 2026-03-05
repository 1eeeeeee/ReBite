import React from 'react';
import { 
  StyleSheet, View, Text, ScrollView, 
  TouchableOpacity, SafeAreaView 
} from 'react-native';

const AdminView = ({ onLogout }) => {
  // 模擬後台數據
  const stats = [
    { label: '合作店家', value: '128', unit: '家', color: '#3D5A45' },
    { label: '註冊用戶', value: '1,540', unit: '人', color: '#3D5A45' },
    { label: '減碳總量', value: '342.5', unit: 'kg', color: '#3D5A45' },
  ];

  const shops = [
    { name: 'Green Bakery', location: '台北市信義區', joined: '2025/12/01' },
    { name: 'Pure Food', location: '台北市大安區', joined: '2025/12/15' },
    { name: '日和食堂', location: '新北市板橋區', joined: '2026/01/10' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 頂部導覽 */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoIcon}>🍃</Text>
          <Text style={styles.logoText}>ReBite Admin</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutText}>系統登出</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.welcomeText}>⚡ 營運數據總覽</Text>

        {/* 數據卡片區 */}
        <View style={styles.statsGrid}>
          {stats.map((item, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <View style={styles.valueRow}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statUnit}>{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 圖表模擬區 */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>📈 月度減碳趨勢</Text>
          <View style={styles.chartPlaceholder}>
            {/* 這裡模擬一個簡單的長條圖視覺 */}
            {[40, 60, 45, 90, 75, 95].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h }]} />
            ))}
          </View>
        </View>

        {/* 合作店家列表 */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>🏪 合作店家管理</Text>
            <TouchableOpacity><Text style={styles.moreText}>查看全部 ❯</Text></TouchableOpacity>
          </View>
          {shops.map((shop, index) => (
            <View key={index} style={styles.listItem}>
              <View>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopInfo}>{shop.location}</Text>
              </View>
              <Text style={styles.joinDate}>{shop.joined}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9F9F4' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', 
    padding: 20, backgroundColor: '#FFF', alignItems: 'center' 
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { fontSize: 24, marginRight: 8 },
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#3D5A45' },
  logoutBtn: { backgroundColor: '#F0F2F0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  logoutText: { fontSize: 12, color: '#666', fontWeight: 'bold' },

  container: { padding: 25 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#3D5A45', marginBottom: 20 },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { 
    backgroundColor: '#FFF', width: '31%', padding: 15, 
    borderRadius: 20, elevation: 2, alignItems: 'center' 
  },
  statLabel: { fontSize: 12, color: '#999', marginBottom: 5 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#3D5A45' },
  statUnit: { fontSize: 10, color: '#3D5A45', marginLeft: 2 },

  chartSection: { 
    backgroundColor: '#3D5A45', borderRadius: 25, padding: 20, marginBottom: 25 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#FFF' },
  chartPlaceholder: { 
    height: 120, flexDirection: 'row', alignItems: 'flex-end', 
    justifyContent: 'space-around', paddingBottom: 10 
  },
  bar: { width: 30, backgroundColor: '#A9C0B0', borderRadius: 5 },

  listSection: { backgroundColor: '#FFF', borderRadius: 25, padding: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitleDark: { fontSize: 18, fontWeight: 'bold', color: '#3D5A45' },
  moreText: { color: '#999', fontSize: 12 },
  listItem: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F2F0' 
  },
  shopName: { fontSize: 16, fontWeight: 'bold', color: '#3D5A45' },
  shopInfo: { fontSize: 12, color: '#999', marginTop: 2 },
  joinDate: { fontSize: 12, color: '#CCC' }
});

export default AdminView;