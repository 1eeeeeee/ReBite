import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, 
  TouchableOpacity, Dimensions, Platform 
} from 'react-native';

const { width } = Dimensions.get('window');

const AdminView = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 檢查是否為 Web 環境且寬度足夠
  const isWebView = Platform.OS === 'web' && width > 768;

  if (!isWebView && Platform.OS !== 'web') {
    return (
      <View style={styles.mobileWarning}>
        <Text style={styles.warningIcon}>💻</Text>
        <Text style={styles.warningTitle}>管理系統僅限 Web 端</Text>
        <Text style={styles.warningSub}>為了確保數據安全與操作體驗，請使用電腦瀏覽器開啟後台管理系統。</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onLogout}>
          <Text style={styles.backBtnText}>返回登入頁</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* --- 左側固定導覽欄 --- */}
      <View style={styles.sidebar}>
        <View style={styles.logoSection}>
          <Text style={styles.logoIcon}>🍃</Text>
          <Text style={styles.logoText}>ReBite Admin</Text>
        </View>

        <View style={styles.navGroup}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]} 
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[styles.navText, activeTab === 'dashboard' && styles.navTextActive]}>📊 數據總覽</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'merchants' && styles.navItemActive]} 
            onPress={() => setActiveTab('merchants')}
          >
            <Text style={[styles.navText, activeTab === 'merchants' && styles.navTextActive]}>🏪 商家管理</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'users' && styles.navItemActive]} 
            onPress={() => setActiveTab('users')}
          >
            <Text style={[styles.navText, activeTab === 'users' && styles.navTextActive]}>👥 會員清單</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>🚪 安全登出</Text>
        </TouchableOpacity>
      </View>

      {/* --- 右側內容區 --- */}
      <View style={styles.contentArea}>
        <View style={styles.topHeader}>
          <Text style={styles.topHeaderTitle}>
            {activeTab === 'dashboard' ? '系統數據即時監控' : '管理面板'}
          </Text>
          <Text style={styles.adminName}>管理員：System_Admin</Text>
        </View>

        <ScrollView style={styles.mainScroll} contentContainerStyle={styles.scrollContent}>
          
          {/* 數據卡片列 */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>累計減碳總量</Text>
              <Text style={styles.statValue}>4,528 <Text style={styles.unit}>kg</Text></Text>
              <Text style={styles.statTrend}>↑ 12.5% 本月增長</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>合作商家總數</Text>
              <Text style={styles.statValue}>86 <Text style={styles.unit}>家</Text></Text>
              <Text style={styles.statTrend}>↑ 3 家 新進駐</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>拯救剩食份數</Text>
              <Text style={styles.statValue}>12,042 <Text style={styles.unit}>份</Text></Text>
              <Text style={styles.statTrend}>平均每日 150+ 份</Text>
            </View>
          </View>

          {/* 模擬圖表區 */}
          <View style={styles.chartSection}>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartTitle}>📈 每日減碳趨勢 (模擬圖表區)</Text>
              <View style={styles.mockGraph}>
                <View style={[styles.bar, {height: '40%'}]} />
                <View style={[styles.bar, {height: '60%'}]} />
                <View style={[styles.bar, {height: '50%'}]} />
                <View style={[styles.bar, {height: '80%'}]} />
                <View style={[styles.bar, {height: '70%'}]} />
                <View style={[styles.bar, {height: '90%'}]} />
              </View>
            </View>

            <View style={styles.recentActivity}>
              <Text style={styles.chartTitle}>🔔 最近系統動態</Text>
              <Text style={styles.activityLog}>• [商家] Green Bakery 上架了 15 份惜食品</Text>
              <Text style={styles.activityLog}>• [會員] 林小姐 成功核銷了 歐式麵包</Text>
              <Text style={styles.activityLog}>• [系統] 成功發送週報至 1,200 名會員</Text>
            </View>
          </View>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#F0F2F5' },
  
  // 側邊欄
  sidebar: { width: 260, backgroundColor: '#2A332C', padding: 25, justifyContent: 'space-between' },
  logoSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  logoIcon: { fontSize: 28, marginRight: 10 },
  logoText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  navGroup: { flex: 1 },
  navItem: { padding: 15, borderRadius: 12, marginBottom: 10 },
  navItemActive: { backgroundColor: '#3D5A45' },
  navText: { color: '#A9C0B0', fontSize: 16 },
  navTextActive: { color: '#FFF', fontWeight: 'bold' },
  logoutBtn: { padding: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: 20 },
  logoutBtnText: { color: '#FF6B6B', textAlign: 'center', fontWeight: 'bold' },

  // 右側內容
  contentArea: { flex: 1 },
  topHeader: { height: 70, backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 30, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  topHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  adminName: { color: '#888' },

  mainScroll: { flex: 1 },
  scrollContent: { padding: 30 },

  // 數據卡片
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
  statCard: { flex: 1, backgroundColor: '#FFF', padding: 25, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  statLabel: { color: '#888', fontSize: 14, marginBottom: 10 },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#3D5A45' },
  unit: { fontSize: 16, color: '#AAA' },
  statTrend: { color: '#28A745', fontSize: 12, marginTop: 10, fontWeight: 'bold' },

  // 圖表區
  chartSection: { flexDirection: 'row', gap: 20 },
  chartPlaceholder: { flex: 2, backgroundColor: '#FFF', borderRadius: 20, padding: 25, height: 400 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  mockGraph: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: 20 },
  bar: { width: 40, backgroundColor: '#3D5A45', borderRadius: 5, opacity: 0.7 },
  recentActivity: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, padding: 25 },
  activityLog: { fontSize: 13, color: '#666', marginBottom: 15, lineHeight: 20 },

  // 手機警告頁面
  mobileWarning: { flex: 1, backgroundColor: '#FCF8EC', justifyContent: 'center', alignItems: 'center', padding: 40 },
  warningIcon: { fontSize: 80, marginBottom: 20 },
  warningTitle: { fontSize: 24, fontWeight: 'bold', color: '#3D5A45', marginBottom: 15 },
  warningSub: { textAlign: 'center', color: '#888', lineHeight: 24, marginBottom: 30 },
  backBtn: { backgroundColor: '#3D5A45', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  backBtnText: { color: '#FFF', fontWeight: 'bold' }
});

export default AdminView;