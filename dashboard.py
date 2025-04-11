import streamlit as st
import pandas as pd
import altair as alt
import plotly.graph_objs as go

# Hardcoded sample data for your cities
data = {
    'City': ['Patto', 'Mala', 'Dona Paula', 'Taleigao', 'Santa Cruz', 'Miramar'],
    'Incidents': [110, 165, 87, 132, 74, 190]
}

df = pd.DataFrame(data)

# Set a threshold to mark hotspots
HOTSPOT_THRESHOLD = 120
df['Hotspot'] = df['Incidents'] > HOTSPOT_THRESHOLD

# Title
st.title("🧹 Littering Detection - City Analytics Dashboard (Panaji)")

# Chart: Bar
st.subheader("🚩 Littering Incidents by Area")
bar_chart = alt.Chart(df).mark_bar().encode(
    x='City',
    y='Incidents',
    color=alt.condition(
        alt.datum.Incidents > HOTSPOT_THRESHOLD,
        alt.value('orangered'),
        alt.value('steelblue')
    )
).properties(height=400)

st.altair_chart(bar_chart, use_container_width=True)

# Pie chart
st.subheader("🧾 Area-wise Contribution")
pie_chart = go.Figure(data=[go.Pie(
    labels=df['City'],
    values=df['Incidents'],
    hole=.3
)])
st.plotly_chart(pie_chart, use_container_width=True)

# Highlight Hotspots
st.subheader("🔥 Hotspot Areas (Above Threshold)")
hotspots = df[df['Hotspot'] == True]
if not hotspots.empty:
    st.markdown("### 🚨 Immediate Attention Required:")
    st.table(hotspots[['City', 'Incidents']])
else:
    st.success("No hotspots detected! 👌")

# Optional: Add update timestamp
import datetime
st.markdown(f"*Last updated: {datetime.datetime.now().strftime('%B %d, %Y %H:%M:%S')}*")
